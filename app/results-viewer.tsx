'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import { MousePointer2 } from 'lucide-react';
import Image from 'next/image';
import results from './viewer-results.json';
import TextResultsViewer from './text-results-viewer';
import InteractiveResultsViewer from './interactive-results-viewer';
import { assetPath } from './asset-path';

type Granularity = 'coarse' | 'fine';
const modes = [
  { id: 'full', label: 'Full shape' },
  { id: 'text', label: 'Text guided' },
  { id: 'interactive', label: 'Interactive' },
] as const;
type ResultMode = (typeof modes)[number]['id'];

export default function ResultsViewer() {
  const [resultMode, setResultMode] = useState<ResultMode>('full');
  const [meshIndex, setMeshIndex] = useState(0);
  const [granularity, setGranularity] = useState<Granularity>('fine');
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const example = results[meshIndex];
  const variant = example.variants[granularity];

  useEffect(() => {
    const viewer = container.current?.querySelector('model-viewer');
    if (!viewer) return;
    setStatus('loading');
    const loaded = () => setStatus('ready');
    const failed = () => setStatus('error');
    viewer.addEventListener('load', loaded);
    viewer.addEventListener('error', failed);
    if ((viewer as HTMLElement & { loaded?: boolean }).loaded) loaded();
    const timer = window.setTimeout(
      () => setStatus((current) => (current === 'loading' ? 'error' : current)),
      45000,
    );
    return () => {
      viewer.removeEventListener('load', loaded);
      viewer.removeEventListener('error', failed);
      window.clearTimeout(timer);
    };
  }, [variant.src, retry, resultMode]);

  return (
    <div className="results-browser">
      <nav className="example-tabs" aria-label="Segmentation mode">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={resultMode === mode.id ? 'is-active' : ''}
            aria-pressed={resultMode === mode.id}
            aria-controls="segmentation-results"
            onClick={() => {
              setResultMode(mode.id);
              setGranularity('fine');
            }}
          >
            {mode.label}
          </button>
        ))}
      </nav>
      <div id="segmentation-results">
        {resultMode === 'full' ? (
          <>
            <div className="result-controls">
              <fieldset className="mesh-picker">
                <legend>Mesh</legend>
                <div className="mesh-thumbnails">
                  {results.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      className="mesh-thumbnail"
                      aria-label={`Full shape result ${index + 1}`}
                      aria-pressed={meshIndex === index}
                      onClick={() => {
                        setGranularity('fine');
                        if (meshIndex !== index) {
                          setMeshIndex(index);
                          setStatus('loading');
                        }
                      }}
                    >
                      <Image
                        src={assetPath(item.thumbnail)}
                        alt=""
                        width={60}
                        height={60}
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="viewer-demo result-demo">
              <div className="viewer-stage">
                <fieldset className="granularity-picker">
                  <legend>Granularity</legend>
                  <div>
                    {(['coarse', 'fine'] as const).map((mode) => (
                      <label
                        key={mode}
                        className={granularity === mode ? 'is-selected' : ''}
                      >
                        <input
                          type="radio"
                          name="granularity"
                          value={mode}
                          checked={granularity === mode}
                          onChange={() => {
                            setGranularity(mode);
                            setStatus('loading');
                          }}
                        />
                        {mode === 'coarse' ? 'Coarse' : 'Fine'}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div
                  className="viewer-canvas"
                  ref={container}
                  aria-busy={status === 'loading'}
                >
                  {createElement('model-viewer', {
                    key: `${variant.src}-${retry}`,
                    src: assetPath(variant.src),
                    alt: `Full shape result ${meshIndex + 1}, ${granularity} segmentation`,
                    class: 'model-viewer',
                    'camera-controls': true,
                    'camera-orbit': example.cameraOrbit,
                    'auto-rotate': true,
                    'auto-rotate-delay': 0,
                    'rotation-per-second': '14deg',
                    'shadow-intensity': '0.3',
                    exposure: '1',
                    'environment-image': 'neutral',
                    'interaction-prompt': 'none',
                    'touch-action': 'pan-y',
                  })}
                  {status === 'loading' && (
                    <output className="viewer-status">Loading model…</output>
                  )}
                  {status === 'error' && (
                    <div className="viewer-status" role="alert">
                      Unable to load this model.{' '}
                      <button onClick={() => setRetry((value) => value + 1)}>
                        Retry
                      </button>
                    </div>
                  )}
                  <div className="viewer-hint">
                    <MousePointer2 size={15} /> Drag to rotate · Scroll to zoom
                  </div>
                </div>
              </div>

              <aside
                className="viewer-context result-details"
                aria-live="polite"
              >
                <div className="result-prompt">
                  <h3>User Prompt</h3>
                  <p>{variant.prompt}</p>
                </div>
                <div className="result-labels">
                  <h3>Predicted Labels</h3>
                  <ul>
                    {variant.labels.map((part) => (
                      <li key={part.id}>
                        <span
                          className="part-swatch"
                          style={{ backgroundColor: part.color }}
                          aria-hidden="true"
                        />
                        <span>{part.label}</span>
                        <small>#{part.id + 1}</small>
                      </li>
                    ))}
                    {'hasUnsegmented' in variant && variant.hasUnsegmented && (
                      <li>
                        <span
                          className="part-swatch"
                          style={{ backgroundColor: '#c0c0c0' }}
                          aria-hidden="true"
                        />
                        <span>Unsegmented area</span>
                      </li>
                    )}
                  </ul>
                </div>
              </aside>
            </div>
          </>
        ) : resultMode === 'text' ? (
          <TextResultsViewer />
        ) : (
          <InteractiveResultsViewer />
        )}
      </div>
    </div>
  );
}
