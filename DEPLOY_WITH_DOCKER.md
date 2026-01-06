# Deploy com Docker

Passos rápidos:

1) Build da imagem localmente:

```
# na raiz do projeto
docker build -t historias-para-sonhar:latest .
# ou com compose
docker-compose build
```

2) Rodar o container:

```
docker run -d -p 80:80 --name historias -e NODE_ENV=production historias-para-sonhar:latest
# ou
docker-compose up -d
```

3) Opções para VPS:

- Build no servidor: clone o repositório, rode `docker build` e `docker run`.
- Usar registry (ex.: Docker Hub): build local, `docker push <user>/historias-para-sonhar:latest`, depois no VPS `docker pull` e `docker run`.

4) HTTPS:

- Recomendo Caddy por TLS automático (config simples e renovação automática).
- Alternativa: colocar Nginx como reverse proxy e usar Certbot para Let's Encrypt.

5) Variáveis de ambiente:

- Passe `GEMINI_API_KEY` como variável de ambiente no `docker run` ou no `docker-compose.yml` (ex.: `-e GEMINI_API_KEY=seu_token`).

Observações:

- Se você usar o build em um servidor com pouco espaço, prefira construir localmente e subir a imagem ao registry.
- Configure firewall para liberar a porta 80/443 no VPS, e considere usar UFW ou regras do provedor.

## Deploy com Traefik (Docker Swarm) 🔀

No seu caso, o domínio já está apontado para o servidor: **use `ebook.onethy.com`** no `docker-stack.yml` (exemplo abaixo já atualizado).

```yaml
version: '3.8'

services:
  historias:
    image: historias-para-sonhar:latest
    deploy:
      replicas: 1
      labels:
        - traefik.enable=true
        - traefik.http.routers.historias.rule=Host(`ebook.onethy.com`)
        - traefik.http.routers.historias.entrypoints=websecure
        - traefik.http.routers.historias.tls=true
        - traefik.http.routers.historias.tls.certresolver=letsencryptresolver
        - traefik.http.services.historias.loadbalancer.server.port=80
    networks:
      - onet
    secrets:
      - gemini_api_key

networks:
  onet:
    external: true

secrets:
  gemini_api_key:
    external: true
```

Passos sugeridos:

1. No servidor (ou localmente se preferir):
   - `docker build -t historias-para-sonhar:latest .` (ou faça o push para um registry se preferir)
2. (Opcional) Crie o secret com a chave Gemini:
   - `echo "SEU_TOKEN" | docker secret create gemini_api_key -`
   - Se não quiser usar secrets, você pode passar `GEMINI_API_KEY` via `environment` (menos seguro).
3. Deploy do stack no Swarm:
   - `docker stack deploy -c docker-stack.yml historias`
4. Verifique:
   - `docker service ls`
   - `docker service ps historias_historias`
   - Dashboard do Traefik para ver os routers/serviços e o status do TLS
---

## Script de deploy no VPS (recomendado) 🔧

Criei `scripts/deploy_remote.sh` para executar automaticamente os passos de deploy no VPS. Ele faz login no GHCR (usando `GHCR_USER`/`GHCR_TOKEN`), puxa a imagem, cria o secret `gemini_api_key` (se `GEMINI_KEY` for fornecida), baixa e atualiza `docker-stack.yml` e executa `docker stack deploy`.

Uso no servidor:

```
# torne o script executável (uma vez):
chmod +x scripts/deploy_remote.sh

# execute com as variáveis de ambiente necessárias:
GHCR_USER=danie2022157-beep GHCR_TOKEN=SEU_TOKEN GEMINI_KEY=SEU_GEMINI_KEY ./scripts/deploy_remote.sh

# ou sem GEMINI_KEY (se você já criou o secret manualmente):
GHCR_USER=danie2022157-beep GHCR_TOKEN=SEU_TOKEN ./scripts/deploy_remote.sh
```

O script verifica Docker/Swarm, faz login no GHCR, puxa a imagem e faz o deploy da stack; ao final imprime comandos úteis para depuração (logs e status).

> Segurança: **não** compartilhe tokens/chaves neste chat. Use variáveis de ambiente ou `docker secret` no servidor.
Comandos úteis para depuração de TLS/ACME:

- Monitorar logs do Traefik (veja as tentativas de ACME e erros):
  - `docker service logs --follow traefik_traefik`
- Verificar logs do seu serviço:
  - `docker service logs --follow historias_historias`
- Depois que o Traefik emitir o certificado, o router `historias` deve aparecer no dashboard com TLS ativo e o domínio `ebook.onethy.com`.

> Observação: o Traefik só emitirá certificados se o domínio apontar para o IP do seu servidor e as portas 80/443 estiverem acessíveis.

## CI/CD: GitHub Actions (build -> GHCR -> deploy por SSH) ⚙️

Como o repositório já está no GitHub, criei um workflow de exemplo em `.github/workflows/ci-cd.yml` para:

- buildar a imagem Docker e publicar no **GitHub Container Registry (GHCR)**;
- se você fornecer `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`, `GHCR_USERNAME` e `GHCR_TOKEN` como secrets no repositório, o workflow fará SSH no servidor e rodará o `docker pull` + `docker stack deploy` automaticamente.

Secrets recomendados (adicionar em Settings → Secrets → Actions):

- `SSH_PRIVATE_KEY` — a chave privada SSH (recomendo usar chave, não senha). Se tiver só senha, posso adaptar, mas chave é mais seguro.
- `SSH_HOST` — IP do servidor (`216.22.5.37`).
- `SSH_USER` — usuário SSH (`root` ou outro usuário com permissão para rodar Docker).
- `GHCR_USERNAME` — seu usuário GitHub (`danie2022157-beep`).
- `GHCR_TOKEN` — Personal Access Token com `read:packages` (usado no servidor para `docker login ghcr.io`).
- `GEMINI_API_KEY` — sua chave Gemini (usada pelo container). Opcional: o workflow não expõe esse valor; você pode criar esse secret no servidor como um secret do Docker Swarm com `docker secret create`.

Importante:

- **Não** armazene senhas em texto claro no repositório ou no chat. Recomendo remover a senha que você postou aqui e usar um par de chaves SSH (adicione a chave pública em `/root/.ssh/authorized_keys` no servidor).
- Se você preferir deploy sem SSH (push + manual deploy), o workflow já faz build+push e você pode fazer `docker pull` e `docker stack deploy` manualmente no VPS.

---

Se quiser, eu posso:

- gerar o workflow completo (já criado em `.github/workflows/ci-cd.yml` neste repositório),
- ajudar a criar os secrets no GitHub (te passo os comandos e instruções),
- e, se autorizar, disparar o deploy agora (você precisa adicionar o `SSH_PRIVATE_KEY`, `GHCR_TOKEN` e outras secrets no repositório primeiro).


1. No servidor (ou localmente se preferir):
   - `docker build -t historias-para-sonhar:latest .` (ou faça o push para um registry se preferir)
2. (Opcional) Crie o secret com a chave Gemini:
   - `echo "SEU_TOKEN" | docker secret create gemini_api_key -`
   - Se não quiser usar secrets, você pode passar `GEMINI_API_KEY` via `environment` (menos seguro).
3. Deploy do stack no Swarm:
   - `docker stack deploy -c docker-stack.yml historias`
4. Verifique:
   - `docker service ls`
   - `docker service ps historias_historias`
   - Dashboard do Traefik para ver os routers/serviços e o status do TLS

> Observação: o Traefik só emitirá certificados se o domínio apontar para o IP do seu servidor e as portas 80/443 estiverem acessíveis.
