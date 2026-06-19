import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import {
  rehypeCode,
  rehypeCodeDefaultOptions,
} from "fumadocs-core/mdx-plugins/rehype-code";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/tmp",
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    rehypePlugins: [
      [
        rehypeCode,
        {
          ...rehypeCodeDefaultOptions,
          langAlias: {
            env: "dotenv",
            caddy: "nginx",
          },
          fallbackLanguage: "text",
        },
      ],
    ],
  },
});
