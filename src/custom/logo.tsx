import React from 'react';

interface Props {
  className?: string;
}

interface LogoProps extends Props {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({}) => {
  return (
    <svg
      width="120"
      height="32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <path
        d="M13.481 17.923V22H0V0h5.19v17.923h8.291zM22.89 22h-5.22V0h5.22v22zM59.22 0l-6.91 22h-4.698L43.405 8.365a7.978 7.978 0 01-.23-.694 46.186 46.186 0 01-.215-.816c-.072.282-.143.554-.215.816a7.945 7.945 0 01-.23.694L38.246 22h-4.698l-6.91-22h4.36c.451 0 .825.1 1.122.302.307.201.506.468.598.8l3.071 11.476c.093.362.185.76.277 1.193.092.422.184.865.276 1.329.184-.947.41-1.787.676-2.522L40.64 1.102c.093-.282.287-.533.584-.755C41.532.116 41.9 0 42.33 0h1.536c.45 0 .814.106 1.09.317.276.201.486.463.63.785l3.592 11.476c.267.705.492 1.505.676 2.4.082-.452.164-.875.246-1.268.092-.402.184-.78.276-1.132l3.071-11.476c.082-.292.276-.548.583-.77.307-.221.676-.332 1.106-.332h4.084zM73.229 13.59l-2.073-6.025a26.35 26.35 0 01-.491-1.344 43.92 43.92 0 01-.522-1.691 24.185 24.185 0 01-.983 3.065l-2.058 5.995h6.127zM81.474 22h-4.023c-.45 0-.813-.1-1.09-.302a2.029 2.029 0 01-.63-.8l-1.32-3.835h-8.506l-1.32 3.835c-.113.282-.318.538-.615.77-.287.221-.645.332-1.075.332h-4.053l8.66-22h5.312l8.66 22z"
        fill="#0D0D0D"
      />
      <path
        d="M95 17.046C95 19.782 92.744 22 89.962 22c-2.783 0-5.038-2.218-5.038-4.954 0-2.737 2.255-4.955 5.038-4.955 2.782 0 5.038 2.218 5.038 4.955z"
        fill="#F25A38"
      />
    </svg>
  );
};
