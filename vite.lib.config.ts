import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/index.ts", "src/MedicalWorkflowOrb.tsx"],
      outDirs: ["dist/lib"],
    }),
  ],
  build: {
    copyPublicDir: false,
    outDir: "dist/lib",
    emptyOutDir: false,
    lib: {
      entry: "src/index.ts",
      name: "MedOrb",
      fileName: "medorb",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
