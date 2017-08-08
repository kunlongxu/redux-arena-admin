
export function calcFrameSize(width) {
  let frameSize = 'medium';
  if (width < 426) frameSize = 'small';
  if (width > 768) frameSize = 'large';
  if (width > 1440) frameSize = 'largeL';
  return frameSize;
}