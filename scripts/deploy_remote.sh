#!/usr/bin/env bash
set -euo pipefail

# deploy_remote.sh
# Uso:
# GHCR_USER=danie2022157-beep GHCR_TOKEN=xxx GEMINI_KEY=yyy ./scripts/deploy_remote.sh

REPO_IMAGE="ghcr.io/danie2022157-beep/10-historias:latest"
STACK_URL="https://raw.githubusercontent.com/danie2022157-beep/10-historias/main/docker-stack.yml"
TMP_STACK="/tmp/docker-stack.yml"
SECRET_NAME="gemini_api_key"

function info { echo "[INFO] $*"; }
function err { echo "[ERROR] $*" >&2; exit 1; }

info "Verificando Docker..."
if ! command -v docker >/dev/null 2>&1; then
  err "Docker não encontrado. Instale o Docker no servidor antes de prosseguir."
fi

info "Verificando se Swarm está ativo..."
if ! docker info --format '{{json .Swarm.LocalNodeState}}' 2>/dev/null | grep -q "active"; then
  err "Docker Swarm não está ativo neste nó. Execute 'docker swarm init' (ou junte-se ao swarm) antes de prosseguir."
fi

info "Fazendo login no GHCR..."
if [ -z "${GHCR_TOKEN-}" ] || [ -z "${GHCR_USER-}" ]; then
  echo "ATENÇÃO: variáveis GHCR_USER e GHCR_TOKEN não definidas. Tentando login interativo..."
  docker login ghcr.io || err "Falha no login interativo no GHCR"
else
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin || err "Falha ao logar no GHCR"
fi

info "Pull da imagem $REPO_IMAGE"
docker pull "$REPO_IMAGE" || err "Falha ao puxar a imagem $REPO_IMAGE"

info "Baixando stack file..."
curl -fsSL "$STACK_URL" -o "$TMP_STACK" || err "Falha ao baixar $STACK_URL"

info "Atualizando imagem no stack file para $REPO_IMAGE"
sed -i "s#image: .*#image: $REPO_IMAGE#" "$TMP_STACK"

if [ -n "${GEMINI_KEY-}" ]; then
  info "Criando secret Docker Swarm '$SECRET_NAME' (se não existir)"
  if ! docker secret ls --format '{{.Name}}' | grep -q "^${SECRET_NAME}$"; then
    echo "$GEMINI_KEY" | docker secret create "$SECRET_NAME" - || err "Falha ao criar secret $SECRET_NAME"
  else
    info "Secret $SECRET_NAME já existe; não recriando"
  fi
fi

info "Deployando stack..."
docker stack deploy -c "$TMP_STACK" historias || err "Falha ao deployar stack"

info "Verificando serviços"
docker service ls

info "Mostrando últimas 100 linhas dos logs do serviço"
docker service logs --tail 100 historias_historias || true

info "Deploy concluído. Se houver problemas com TLS, verifique os logs do Traefik: docker service logs --follow traefik_traefik"
