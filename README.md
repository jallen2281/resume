# resume

Jared Allen's resume, built from a single [JSON Resume](https://jsonresume.org) file and served from the kegbot.net cluster at **https://resume.kegbot.net**.

`resume.json` → themed HTML + PDF (CI) → multi-arch nginx image on GHCR → ArgoCD.

## Edit the resume

1. Change `resume.json` (schema: https://jsonresume.org/schema).
2. Push to `main`. GitHub Actions validates it, renders `dist/index.html` and `dist/Jared-Allen-Resume.pdf`, builds `ghcr.io/jallen2281/resume:<sha>` for amd64 and arm64, and commits the new tag to `k8s/kustomization.yaml`.
3. ArgoCD picks up the tag change and rolls the deployment.

## Local preview

```bash
npm ci
npm run build                 # dist/index.html
npm run pdf                   # dist/Jared-Allen-Resume.pdf
npx serve dist                # or open dist/index.html
```

If Puppeteer can't download Chrome locally, point it at an installed one:
`PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome npm run pdf`

## First-time setup

1. **Create the repo** `jallen2281/resume` on GitHub and push this folder to `main`.
2. **Repo settings → Actions → General → Workflow permissions:** choose *Read and write permissions* (the workflow commits the image tag back).
3. **GHCR visibility:** after the first build, either make the `resume` package public (Packages → resume → Package settings), or create a pull secret in the `resume` namespace and uncomment `imagePullSecrets` in `k8s/deployment.yaml`:
   ```bash
   kubectl -n resume create secret docker-registry ghcr-pull \
     --docker-server=ghcr.io --docker-username=jallen2281 --docker-password=<PAT with read:packages>
   ```
4. **ArgoCD:** copy `argocd/resume-application.yaml` into the aiCluster repo (match its repoURL style to your other apps) and push.
5. **DNS:** in PowerDNS-Admin, add `resume.kegbot.net` (A record to your ingress IP, or a CNAME to kegbot.net).
6. **Ingress/TLS:** `k8s/ingress.yaml` assumes the MicroK8s `public` ingress class. Uncomment the cert-manager annotation and `tls` block if you use cert-manager.

## Search engines

The page ships with `noindex` (meta tag + `X-Robots-Tag` header) so it isn't searchable while the job search is quiet. Anyone with the link can still view it. To allow indexing later, remove the header in `nginx.conf` and set `ALLOW_INDEXING: "true"` as an env var on the *Render HTML* step.

## GitHub profile README

`profile-readme/README.md` is a starter for your profile page. Create a public repo named `jallen2281` and put it there as `README.md`.
