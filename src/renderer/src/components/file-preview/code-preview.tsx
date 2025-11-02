import { useState, useEffect, memo } from 'react';
import { codeToHtml } from 'shiki';
import type { CodePreviewProps } from './types';
import type { ThemeRegistration } from 'shiki';

const LANGUAGE_MAP: Record<string, string> = {
  'application/javascript': 'javascript',
  'application/typescript': 'typescript',
  'text/javascript': 'javascript',
  'text/typescript': 'typescript',
  'application/json': 'json',
  'application/xml': 'xml',
  'text/html': 'html',
  'text/css': 'css',
  'application/x-sh': 'bash',
  'application/x-python': 'python',
  'application/x-ruby': 'ruby',
  'application/x-perl': 'perl',
  'application/x-php': 'php',
  'application/sql': 'sql',
  'text/x-java': 'java',
  'text/x-c': 'c',
  'text/x-cpp': 'cpp',
  'text/x-csharp': 'csharp',
  'text/x-go': 'go',
  'text/x-rust': 'rust'
};

const EXTENSION_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  php: 'php',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  sql: 'sql',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  vue: 'vue',
  svelte: 'svelte'
};

function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function createCustomTheme(): ThemeRegistration {
  const foreground = getCSSVariable('--foreground');
  const mutedForeground = getCSSVariable('--muted-foreground');

  const rosewater = getCSSVariable('--code-rosewater');
  const pink = getCSSVariable('--code-pink');
  const mauve = getCSSVariable('--code-mauve');
  const red = getCSSVariable('--code-red');
  const peach = getCSSVariable('--code-peach');
  const yellow = getCSSVariable('--code-yellow');
  const green = getCSSVariable('--code-green');
  const teal = getCSSVariable('--code-teal');
  const sky = getCSSVariable('--code-sky');
  const sapphire = getCSSVariable('--code-sapphire');
  const blue = getCSSVariable('--code-blue');
  const lavender = getCSSVariable('--code-lavender');

  return {
    name: 'custom-theme',
    type: 'dark',
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': foreground
    },
    tokenColors: [
      {
        scope: ['comment', 'punctuation.definition.comment'],
        settings: { foreground: mutedForeground }
      },
      {
        scope: ['string', 'string.quoted'],
        settings: { foreground: green }
      },
      {
        scope: ['keyword', 'storage.type', 'storage.modifier', 'keyword.control'],
        settings: { foreground: mauve }
      },
      {
        scope: ['entity.name.function', 'support.function', 'meta.function-call'],
        settings: { foreground: blue }
      },
      {
        scope: ['constant.numeric', 'constant.language', 'constant.character'],
        settings: { foreground: peach }
      },
      {
        scope: ['variable', 'support.variable', 'variable.other'],
        settings: { foreground: foreground }
      },
      {
        scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
        settings: { foreground: yellow }
      },
      {
        scope: ['entity.name.tag'],
        settings: { foreground: red }
      },
      {
        scope: ['entity.other.attribute-name'],
        settings: { foreground: mauve }
      },
      {
        scope: ['constant.other.color'],
        settings: { foreground: pink }
      },
      {
        scope: ['meta.tag', 'punctuation.definition.tag'],
        settings: { foreground: sky }
      },
      {
        scope: ['entity.other.inherited-class'],
        settings: { foreground: yellow }
      },
      {
        scope: ['support.constant', 'constant.other'],
        settings: { foreground: peach }
      },
      {
        scope: ['variable.parameter', 'variable.language'],
        settings: { foreground: rosewater }
      },
      {
        scope: ['variable.function'],
        settings: { foreground: blue }
      },
      {
        scope: ['keyword.operator', 'punctuation'],
        settings: { foreground: sky }
      },
      {
        scope: ['string.regexp'],
        settings: { foreground: pink }
      },
      {
        scope: ['support.type.property-name'],
        settings: { foreground: lavender }
      },
      {
        scope: ['markup.heading'],
        settings: { foreground: red, fontStyle: 'bold' }
      },
      {
        scope: ['markup.bold'],
        settings: { foreground: red, fontStyle: 'bold' }
      },
      {
        scope: ['markup.italic'],
        settings: { foreground: red, fontStyle: 'italic' }
      },
      {
        scope: ['markup.list'],
        settings: { foreground: mauve }
      },
      {
        scope: ['markup.quote'],
        settings: { foreground: teal }
      },
      {
        scope: ['markup.inline.raw', 'markup.fenced_code'],
        settings: { foreground: green }
      },
      {
        scope: ['meta.link'],
        settings: { foreground: sapphire }
      }
    ]
  };
}

function detectLanguage(data: CodePreviewProps['data']): string {
  const mimeType = data.mimeType;
  if (mimeType && LANGUAGE_MAP[mimeType]) {
    return LANGUAGE_MAP[mimeType];
  }

  const extension = data.fileName.split('.').pop()?.toLowerCase();
  if (extension && EXTENSION_MAP[extension]) {
    return EXTENSION_MAP[extension];
  }

  return 'text';
}

export const CodePreview = memo(({ data, language }: CodePreviewProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { encoding, content: rawContent, fileName } = data;
  const content = encoding === 'base64' ? atob(rawContent) : rawContent;

  const detectedLanguage = language || detectLanguage(data);

  useEffect(() => {
    let cancelled = false;

    const highlightCode = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const html = await codeToHtml(content, {
          lang: detectedLanguage,
          theme: createCustomTheme(),
          defaultColor: false,
          transformers: [
            {
              line(node) {
                node.properties.class = 'line';
              }
            }
          ]
        });

        if (!cancelled) {
          setHighlightedCode(html);
        }
      } catch (error) {
        console.error('Failed to highlight code:', error);
        if (!cancelled) {
          setHighlightedCode(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void highlightCode();

    return () => {
      cancelled = true;
    };
  }, [content, detectedLanguage]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-medium">{fileName}</h3>
        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
          {detectedLanguage}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading && !highlightedCode ? (
          <pre className="p-6 text-sm font-mono whitespace-pre-wrap">{content}</pre>
        ) : highlightedCode ? (
          <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        ) : (
          <pre className="p-6 text-sm font-mono whitespace-pre-wrap">{content}</pre>
        )}
      </div>
    </div>
  );
});

CodePreview.displayName = 'CodePreview';
