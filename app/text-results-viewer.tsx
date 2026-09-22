'use client';

import { createElement, useState } from 'react';
import Image from 'next/image';
import results from './text-viewer-results.json';
import { assetPath } from './asset-path';

export default function TextResultsViewer() {
  const [selected, setSelected] = useState(0);
  const example = results[selected];
  return (
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
                aria-label={`Text-guided result ${index + 1}`}
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
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
          <div className="viewer-canvas">
            {createElement('model-viewer', {
              key: selected,
              src: assetPath(example.src),
              alt: `Text-guided result ${selected + 1}`,
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
            <div className="viewer-hint">Drag to rotate · Scroll to zoom</div>
          </div>
        </div>
        <aside className="viewer-context result-details" aria-live="polite">
          <div className="result-prompt">
            <h3>User Prompt</h3>
            <p>{example.prompt}</p>
          </div>
          <div className="result-labels">
            <h3>Predicted Labels</h3>
            <ul>
              {example.labels.map((part) => (
                <li key={part.id}>
                  <span
                    className="part-swatch"
                    style={{ backgroundColor: part.color }}
                    aria-hidden="true"
                  />
                  <span>{part.label}</span>
                </li>
              ))}
              {example.hasUnsegmented && (
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
  );
}
