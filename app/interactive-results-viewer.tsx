'use client';

import { createElement, useState } from 'react';
import Image from 'next/image';
import results from './interactive-viewer-results.json';
import { assetPath } from './asset-path';

type Step = 'one' | 'two' | 'three';

const stepLabels: Record<Step, string> = {
  one: '1 point',
  two: '2 points',
  three: '3 points',
};

export default function InteractiveResultsViewer() {
  const [selected, setSelected] = useState(0);
  const example = results[selected];
  const [step, setStep] = useState<Step>(example.defaultStep as Step);
  const availableSteps = Object.keys(example.steps) as Step[];
  const variant =
    example.steps[step as keyof typeof example.steps] ?? example.steps.one;

  const selectExample = (index: number) => {
    setSelected(index);
    setStep(results[index].defaultStep as Step);
  };

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
                aria-label={`Interactive result ${index + 1}`}
                aria-pressed={selected === index}
                onClick={() => selectExample(index)}
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
            <legend>Interaction</legend>
            <div>
              {availableSteps.map((value) => (
                <label
                  key={value}
                  className={step === value ? 'is-selected' : ''}
                >
                  <input
                    type="radio"
                    name="interaction-step"
                    value={value}
                    checked={step === value}
                    onChange={() => setStep(value)}
                  />
                  {stepLabels[value]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="viewer-canvas">
            {createElement(
              'model-viewer',
              {
                key: `${selected}-${step}`,
                src: assetPath(variant.src),
                alt: `Interactive result ${selected + 1}, ${stepLabels[step]} interaction`,
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
              },
              variant.points.map((point) =>
                createElement('span', {
                  key: point.index,
                  slot: `hotspot-${point.index}`,
                  class: `interaction-hotspot is-${point.type} is-point-${point.index}`,
                  'data-position': point.position,
                  'aria-hidden': true,
                }),
              ),
            )}
            <div className="viewer-hint">Drag to rotate · Scroll to zoom</div>
          </div>
        </div>
        <aside className="viewer-context result-details" aria-live="polite">
          <div className="result-prompt">
            <h3>User Prompt</h3>
            <p>{variant.prompt}</p>
          </div>
          <div className="result-labels">
            <h3>Predicted Label</h3>
            <ul>
              <li>
                <span
                  className="part-swatch"
                  style={{ backgroundColor: '#e6194b' }}
                  aria-hidden="true"
                />
                <span>{variant.predictedLabel}</span>
              </li>
              <li>
                <span
                  className="part-swatch"
                  style={{ backgroundColor: '#c0c0c0' }}
                  aria-hidden="true"
                />
                <span>Unsegmented area</span>
              </li>
            </ul>
          </div>
          <div className="result-labels">
            <h3>Interaction Points</h3>
            <ul>
              {variant.points.map((point) => (
                <li key={point.index}>
                  <span
                    className="part-swatch"
                    style={{
                      backgroundColor:
                        point.type === 'positive' ? '#3cb44b' : '#4363d8',
                    }}
                    aria-hidden="true"
                  />
                  <span>
                    {point.type === 'positive'
                      ? 'Positive point'
                      : 'Negative point'}
                  </span>
                  <small>#{point.index}</small>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
