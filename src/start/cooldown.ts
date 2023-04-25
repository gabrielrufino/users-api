import { type MikroORM } from '@mikro-orm/core'
import type http from 'node:http'

const cooldown = ({ server, orm }: {
  orm: MikroORM
  server: http.Server
}) => {
  const close = (code: number) => () => {
    server.close(async () => {
      await orm.close()
      process.exit(code)
    })
  }

  process.on('SIGHUP', close(128 + 1))
  process.on('SIGINT', close(128 + 2))
  process.on('SIGTERM', close(128 + 15))
}

export default cooldown
