# 1. 使用官方 Node.js 22 作为构建阶段
FROM node:22-alpine AS builder

# 2. 设置工作目录
WORKDIR /app

# 3. 复制 package.json 和 lock 文件，优化缓存
COPY package.json package-lock.json* ./

# 4. 安装生产依赖
RUN npm ci --only=production

# 5. 复制所有项目文件
COPY . .

# 6. 运行 Next.js 构建
RUN npm run build

# 7. 仅拷贝生产环境文件到最终运行镜像
FROM node:22-alpine AS runner

# 8. 设置运行环境变量
ENV NODE_ENV production

# 9. 创建非root用户以提高安全性
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 10. 设置工作目录
WORKDIR /app

# 11. 复制必要文件
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next/standalone /app/
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

# 12. 更改文件所有权
RUN chown -R nextjs:nodejs /app

# 13. 切换到非root用户
USER nextjs

# 14. 开放端口（Next.js 默认使用 3000）
EXPOSE 3000

# 15. 设置环境变量
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 16. 运行 Next.js 应用
CMD ["node", "server.js"] 