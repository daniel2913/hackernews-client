import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"

export default defineConfig({
	build:{
		outDir:"dist"
	},
	plugins: [react()],
	esbuild: {
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3007",
				cookiePathRewrite: "/",
				cookieDomainRewrite: "localhost:5173"
			}
		}
	}
})
