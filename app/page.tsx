'use client';

import ResultsViewer from './results-viewer';
import { Box, Code2, FileText, type LucideIcon } from 'lucide-react';
import { assetPath } from './asset-path';

const resources: Array<{ label: string; icon: LucideIcon; href?: string }> = [
  { label: 'Paper', icon: FileText, href: 'https://arxiv.org/abs/2609.25832' },
  { label: 'Code', icon: Code2, href: 'https://github.com/czvvd/PartLLM' },
  { label: 'Model', icon: Box, href: 'https://huggingface.co/Czvvd/PartLLM' },
];

const authors = [
  { name: 'Zhe Zhu', href: 'https://czvvd.github.io/homepage/' },
  { name: 'Yiheng Zhang', href: 'https://graphic-kiliani.github.io/homepage/' },
  { name: 'Peng Li' },
  { name: 'Zixing Zhao' },
  { name: 'Honghua Chen', href: 'https://chenhonghua.github.io/clay/' },
  { name: 'Yaqing Zhang' },
  { name: 'Le Wan' },
  { name: 'Zhiyang Dou', href: 'https://people.csail.mit.edu/frankzydou/' },
  { name: 'Cheng Lin', href: 'https://clinplayer.github.io/', mark: '‡' },
  { name: 'Yuan Liu', href: 'https://liuyuan-pal.github.io/', mark: '†' },
  {
    name: 'Mingqiang Wei',
    href: 'https://scholar.google.com/citations?user=TdrJj8MAAAAJ&hl=en',
    mark: '†',
    linkLabel: 'Google Scholar',
  },
  {
    name: 'Wenping Wang',
    href: 'https://engineering.tamu.edu/cse/profiles/Wang-Wenping.html',
  },
];

export default function Home() {
  return (
    <main>
      <header className="hero shell" id="top">
        <h1>PartLLM</h1>
        <p className="hero-subtitle">
          A Unified Multimodal Foundation for 3D Part Segmentation
        </p>

        <p className="publication-line">
          SIGGRAPH Asia 2026 (ACM Transactions on Graphics)
        </p>

        <div className="author-block" aria-label="Authors">
          {[authors.slice(0, 8), authors.slice(8)].map((row, rowIndex) => (
            <p className="author-list" key={rowIndex}>
              {row.map(({ name, href, mark, linkLabel }) => (
                <span key={name}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        linkLabel ? `${name} — ${linkLabel}` : undefined
                      }
                    >
                      {name}
                    </a>
                  ) : (
                    name
                  )}
                  {mark ? <sup>{mark}</sup> : null}
                </span>
              ))}
            </p>
          ))}
          <p className="author-notes">
            <span>‡ Project lead</span>
            <span>† Corresponding authors</span>
          </p>
        </div>

        <div className="resource-row" aria-label="Project resources">
          {resources.map(({ label, icon: Icon, href }) =>
            href ? (
              <a
                key={label}
                className={`resource-button${label === 'Paper' ? ' resource-button--active' : ''}`}
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
              </a>
            ) : (
              <button
                key={label}
                className={`resource-button${label === 'Paper' ? ' resource-button--active' : ''}`}
                type="button"
                disabled
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ),
          )}
        </div>
      </header>

      <section
        className="teaser-section shell"
        id="teaser"
        aria-label="Teaser video"
      >
        <div className="teaser-frame">
          <video
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="PartLLM paper video"
          >
            <source
              src={`${assetPath('/assets/Paper_Video.mp4')}?v=20260922b`}
              type="video/mp4"
            />
          </video>
          <div className="teaser-summary" aria-labelledby="highlights-title">
            <h2 id="highlights-title">Abstract</h2>
            <div className="highlights-rule" aria-hidden="true" />
            <p className="abstract-copy">
              Part segmentation is a fundamental problem in computer graphics
              and 3D vision. Recent works have expanded 3D part segmentation
              beyond fixed taxonomies, but existing approaches typically only
              address a specific setting, such as text-guided part segmentation
              or point-based interaction. In this work, we argue that these
              settings can be unified as an intent-conditioned generative
              problem, where different prompts specify the desired part
              decomposition. To this end, we introduce PartLLM, a unified
              multimodal model that formulates 3D part segmentation as
              autoregressive semantic decomposition. Conditioned on an input
              shape and a user prompt, PartLLM autoregressively generates
              semantic part hypotheses as queries for mask prediction and feeds
              them to a decomposition-aware decoder that jointly predicts
              coherent part masks. This unified design supports text-guided part
              segmentation, interactive segmentation, and full-shape semantic
              decomposition with controllable granularity within a single model.
              Extensive experiments across these task settings show that PartLLM
              consistently outperforms task-specific baselines, demonstrating
              the effectiveness of unifying 3D part segmentation under an
              intent-conditioned generative formulation.
            </p>
          </div>
        </div>
      </section>

      <section
        className="method-section shell"
        id="method"
        aria-labelledby="method-title"
      >
        <div className="compact-heading">
          <h2 id="method-title">Method Overview</h2>
        </div>
        <div className="teaser-frame">
          <video
            controls
            muted
            playsInline
            preload="none"
            poster={assetPath('/assets/method-overview-poster.jpg')}
            aria-label="PartLLM method overview video"
          >
            <source
              src={assetPath('/assets/method-overview.mp4')}
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section
        className="viewer-section shell"
        id="results"
        aria-labelledby="viewer-title"
      >
        <div className="compact-heading">
          <h2 id="viewer-title">Results</h2>
        </div>

        <ResultsViewer />
      </section>

      <section
        className="citation-section shell"
        id="citation"
        aria-labelledby="citation-title"
      >
        <div className="citation-heading">
          <h2 id="citation-title">BibTeX</h2>
        </div>
        <pre className="citation-card">
          <code>{`@article{zhu2026partllm,
    title={PartLLM: A Unified Multimodal Foundation for 3D Part Segmentation},
    author={Zhe Zhu and Yiheng Zhang and Peng Li and Zixing Zhao and Honghua Chen and Yaqing Zhang and Le Wan and Zhiyang Dou and Cheng Lin and Yuan Liu and Mingqiang Wei and Wenping Wang},
    journal={ACM Transactions on Graphics},
    volume={45},
    number={6},
    articleno={178},
    year={2026},
    month={dec},
    doi={10.1145/3842577}
}`}</code>
        </pre>
      </section>
    </main>
  );
}
