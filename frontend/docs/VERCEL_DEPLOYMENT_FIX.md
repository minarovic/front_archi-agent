# Vercel Deployment Fix - Dec 2, 2025

## Problém
Vercel deploymenty zlyhávali s TypeScript chybou:

```
src/components/DebugPanel.tsx:6:7 - error TS2580: Cannot find name 'process'.
Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.

6   if (process.env.NODE_ENV === 'production') {
        ~~~~~~~
```

## Príčina
- `DebugPanel.tsx` používal Node.js API `process.env.NODE_ENV`
- Vite projekty nemajú prístup k `process` objektu bez explicitnej konfigurácie
- TypeScript build zlyhal pred samotným Vite buildom

## Riešenie
Nahradené Node.js env var Vite štandardom:

```diff
- if (process.env.NODE_ENV === 'production') {
+ if (import.meta.env.PROD) {
```

### Vite Environment Variables
| Vite                   | Node.js                                  | Popis                        |
| ---------------------- | ---------------------------------------- | ---------------------------- |
| `import.meta.env.PROD` | `process.env.NODE_ENV === 'production'`  | Production build             |
| `import.meta.env.DEV`  | `process.env.NODE_ENV === 'development'` | Development mode             |
| `import.meta.env.MODE` | `process.env.NODE_ENV`                   | 'development' / 'production' |

## Verifikácia

### Lokálne build testy
```bash
cd frontend
npm run build  # ✅ Success in 3.81s
```

### Vercel deployment
```bash
vercel --prod
# ✅ Production: https://front-archi-agent-ay7qafg3s-marek-minarovics-projects.vercel.app
```

## Deployment história

| Čas             | Status        | Deployment                     |
| --------------- | ------------- | ------------------------------ |
| 21:51 (2h ago)  | ❌ Error       | `iz3iesuul` - TypeScript error |
| 21:49 (2h ago)  | ❌ Error       | `daf52yk3m` - TypeScript error |
| 21:48 (2h ago)  | ❌ Error       | `i6xbytnum` - TypeScript error |
| 18:xx (5h ago)  | ❌ Error       | `g7s5bp91k` - TypeScript error |
| **23:xx (now)** | ✅ **Success** | `ay7qafg3s` - **Fixed!**       |

## Lekcia
- ❌ **Nesprávne:** `process.env.NODE_ENV` v Vite projektoch
- ✅ **Správne:** `import.meta.env.PROD` / `import.meta.env.DEV`
- Vždy lokálne testovať `npm run build` pred push
- Vercel beží TypeScript check pred Vite buildom

## Related Issues
- TypeScript potrebuje `@types/node` pre `process` objekt
- Vite má vlastný environment API cez `import.meta.env`
- Vercel automaticky spúšťa `npm run build` z `vercel.json`

## Prevencia
Pridané do pre-commit checku:
```bash
npm run build  # Musí uspieť pred commitom
```

## Odkazy
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Build Config](https://vercel.com/docs/projects/project-configuration)
- [Production URL](https://front-archi-agent-marek-minarovics-projects.vercel.app)
