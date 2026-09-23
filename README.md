# 逢甲今天吃什麼？ Fengjia Food Finder

逢甲商圈餐廳搜尋與隨機推薦 Web App。使用者可以依料理分類或關鍵字找餐廳，查看評分、價格、地址、電話、菜單、訂餐網址與 Google Maps 位置。

## 功能

- 餐廳關鍵字搜尋
- 飯、麵、日式、泰式分類篩選
- 餐廳卡片與詳細頁
- 「🎲 今天吃什麼？」隨機推薦
- 評分、價格、地址與電話資訊
- Google Maps、菜單、訂餐與官方網站連結
- Responsive Design，支援桌面與手機
- PostgreSQL + Prisma 資料存取

## 技術架構

- **Frontend**：Next.js 16 App Router、React 19、TypeScript、Tailwind CSS 4
- **Backend**：Next.js Route Handlers
- **ORM**：Prisma 6
- **Database**：PostgreSQL
- **Deployment**：Vercel
- **Runtime**：Node.js 24、npm 11

主要路由：

```text
GET /api/restaurants
GET /api/restaurants/[id]
GET /api/restaurants/random
GET /?category=THAI
GET /?search=拉麵
```

## 安裝方式

需求：Node.js 20.9 以上、npm，以及可連線的 PostgreSQL 資料庫。

```bash
git clone <your-github-repository-url>
cd click-target-game
npm install
```

## .env 設定

複製範例環境變數檔：

```bash
copy .env.example .env.local
```

在 `.env.local` 填入 PostgreSQL 連線字串：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

請勿將 `.env.local`、密碼、Token、API Key 或其他秘密資訊提交到 GitHub。`.gitignore` 已忽略 `.env*`，只有 `.env.example` 可提交。

## Database 設定

建立 PostgreSQL database，並確認 `DATABASE_URL` 指向該資料庫。然後產生 Prisma Client：

```bash
npm run db:generate
```

## Prisma Migration

在開發環境套用 migration：

```bash
npm run db:migrate
```

初始 migration 位於 `prisma/migrations/20260923120000_init/`，資料模型位於 `prisma/schema.prisma`。

正式環境部署既有 migration 時，建議使用：

```bash
npx prisma migrate deploy
```

## Seed

Seed 會建立各料理分類的示範餐廳資料：

```bash
npm run db:seed
```

目前 seed 會以固定 id 更新或建立示範資料，不會清除其他餐廳資料；正式資料庫執行前仍建議先確認內容。

## 本機啟動

完成環境變數、migration 與 seed 後：

```bash
npm run dev
```

開啟 <http://localhost:3000>。

驗證 production build：

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## GitHub

```bash
git init
git add .
git commit -m "Build Fengjia Food Finder"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

提交前確認：

- 沒有 `.env.local`
- 沒有資料庫密碼或 API Key
- 沒有將 `node_modules`、`.next` 或 `.open-next` 加入版本控制

## Vercel Deployment

1. 將專案 push 到 GitHub。
2. 登入 [Vercel](https://vercel.com/)，選擇 **Add New Project**。
3. Import 這個 GitHub repository。
4. Framework Preset 選擇 **Next.js**。
5. 在 Vercel Project Settings → Environment Variables 新增：

   ```text
   Name: DATABASE_URL
   Value: 你的 PostgreSQL provider connection string
   Environment: Production、Preview、Development
   ```

6. 部署前確認 PostgreSQL provider 允許 Vercel 的連線；Serverless PostgreSQL 建議使用 provider 提供的 pooled connection string。
7. Deploy project。
8. 部署完成後，在 Vercel 的部署紀錄確認 build 成功。

正式環境建立資料表與套用 migration：

```bash
npx prisma migrate deploy
```

可以在本機暫時以 production `DATABASE_URL` 執行，或在 CI/CD pipeline 執行。不要在 production 執行會清除資料的 `npm run db:seed`，除非你確定資料庫是測試環境。

## 安全提醒

不要將以下內容放入 GitHub：

- `.env.local`
- 真實 PostgreSQL 密碼
- API Key、Token、私密憑證
- 任何包含秘密值的 `.env` 檔案

部署平台的秘密值應透過 Vercel Environment Variables 管理，而不是寫在原始碼或 README 中。