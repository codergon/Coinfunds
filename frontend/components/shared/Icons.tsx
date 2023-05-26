interface IconProps {
  fill?: string;
  size?: number;
  color?: string;
  stroke?: string;
  className?: string;
  onClick?: () => void;
}

const Icons = {
  HandCoins: ({
    onClick,
    size = 24,
    className,
    fill = "#1c1c1c",
    color = "#1c1c1c",
    stroke = "#1c1c1c",
  }: IconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 26 21"
        style={{
          fill: fill,
          width: size,
          height: size * (21 / 26),
        }}
        onClick={onClick}
        className={className}
      >
        <path
          fill="currentColor"
          d="M24.293 12.877a2.577 2.577 0 0 0-2.24-.446l-4.413 1.015a2.952 2.952 0 0 0-2.874-3.633h-5.28a3.356 3.356 0 0 0-2.387.988l-2.386 2.386H1.687A1.687 1.687 0 0 0 0 14.876v4.219a1.688 1.688 0 0 0 1.688 1.687h10.968a.836.836 0 0 0 .205-.025l6.75-1.688a.732.732 0 0 0 .125-.042l4.1-1.744.046-.021a2.595 2.595 0 0 0 .415-4.384h-.004ZM1.688 14.875h2.53v4.219h-2.53v-4.219Zm21.455.866-4.008 1.706-6.584 1.647H5.906V14.38l2.387-2.385a1.674 1.674 0 0 1 1.193-.495h5.28a1.266 1.266 0 1 1 0 2.531h-2.954a.843.843 0 1 0 0 1.688h3.376a.882.882 0 0 0 .188-.021l7.067-1.626.032-.008a.908.908 0 0 1 .665 1.677h.003Zm-5.846-7.616c.208 0 .416-.017.622-.05a3.798 3.798 0 1 0 2.976-4.958 3.797 3.797 0 1 0-3.598 5.008Zm6.328-1.266a2.11 2.11 0 1 1-4.218 0 2.11 2.11 0 0 1 4.218 0Zm-6.328-4.64a2.11 2.11 0 0 1 2.03 1.54 3.797 3.797 0 0 0-1.582 2.63 2.11 2.11 0 1 1-.448-4.17Z"
        />
      </svg>
    );
  },
  Search: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.58342 18.1253C4.87508 18.1253 1.04175 14.292 1.04175 9.58366C1.04175 4.87533 4.87508 1.04199 9.58342 1.04199C14.2917 1.04199 18.1251 4.87533 18.1251 9.58366C18.1251 14.292 14.2917 18.1253 9.58342 18.1253ZM9.58342 2.29199C5.55841 2.29199 2.29175 5.56699 2.29175 9.58366C2.29175 13.6003 5.55841 16.8753 9.58342 16.8753C13.6084 16.8753 16.8751 13.6003 16.8751 9.58366C16.8751 5.56699 13.6084 2.29199 9.58342 2.29199Z" />
      <path d="M18.3333 18.9585C18.175 18.9585 18.0166 18.9002 17.8916 18.7752L16.225 17.1085C15.9833 16.8669 15.9833 16.4669 16.225 16.2252C16.4666 15.9835 16.8666 15.9835 17.1083 16.2252L18.775 17.8919C19.0166 18.1335 19.0166 18.5335 18.775 18.7752C18.65 18.9002 18.4916 18.9585 18.3333 18.9585Z" />
    </svg>
  ),

  GitHub: ({ size = 24 }: IconProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{
          width: size,
          height: size,
        }}
      >
        <path
          fill="currentColor"
          d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z"
        />
      </svg>
    );
  },

  // App Logo
  AppLogo: ({ size = 110 }: IconProps) => {
    return (
      <svg
        fill="none"
        viewBox="0 0 145 29"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: size,
          height: size * (29 / 145),
        }}
      >
        <path
          fill="#111"
          d="M20.125 8.797v-.61c0-2.743-4.138-4.812-9.625-4.812S.875 5.445.875 8.188v4.374c0 2.285 2.871 4.101 7 4.645v.605c0 2.744 4.138 4.813 9.625 4.813s9.625-2.07 9.625-4.813v-4.375c0-2.264-2.78-4.081-7-4.64Zm5.25 4.64c0 1.446-3.368 3.063-7.875 3.063-.408 0-.813-.014-1.212-.04 2.36-.86 3.837-2.257 3.837-3.898v-1.997c3.267.487 5.25 1.808 5.25 2.873Zm-17.5 1.997v-2.602c.87.113 1.747.17 2.625.168.878.001 1.755-.055 2.625-.168v2.602c-.87.128-1.746.192-2.625.191a17.822 17.822 0 0 1-2.625-.191Zm10.5-4.41v1.539c0 .917-1.357 1.903-3.5 2.5v-2.555c1.412-.342 2.608-.852 3.5-1.484ZM10.5 5.125c4.507 0 7.875 1.617 7.875 3.063 0 1.445-3.368 3.062-7.875 3.062S2.625 9.633 2.625 8.187c0-1.445 3.368-3.062 7.875-3.062Zm-7.875 7.438v-1.54c.893.633 2.088 1.143 3.5 1.485v2.556c-2.143-.598-3.5-1.584-3.5-2.502Zm7 5.25v-.457a21.03 21.03 0 0 0 2.12-.02c.453.163.913.3 1.38.412v2.566c-2.143-.598-3.5-1.584-3.5-2.502Zm5.25 2.87v-2.608a20.106 20.106 0 0 0 5.25.007v2.602c-1.74.255-3.51.255-5.25 0Zm7-.37v-2.555c1.412-.342 2.608-.852 3.5-1.484v1.538c0 .918-1.357 1.904-3.5 2.502ZM37.04 21.208c-1.248-.624-2.256-1.608-2.976-2.904-.768-1.296-1.128-2.88-1.128-4.704 0-1.824.36-3.384 1.128-4.704a7.484 7.484 0 0 1 3-2.928 8.89 8.89 0 0 1 4.08-.96c1.248 0 2.4.24 3.48.696a7.358 7.358 0 0 1 2.592 1.992A5.73 5.73 0 0 1 48.44 10.6h-2.616c-.144-.984-.672-1.8-1.536-2.448-.888-.624-1.944-.936-3.168-.936-1.128 0-2.112.264-2.928.744-.864.528-1.536 1.248-1.968 2.16-.48.96-.72 2.136-.72 3.48 0 1.368.24 2.52.72 3.456.432.936 1.104 1.656 1.968 2.184.816.504 1.8.744 2.928.744.816 0 1.584-.144 2.28-.432a4.306 4.306 0 0 0 1.704-1.224c.432-.504.696-1.08.768-1.728h2.52c-.144 1.104-.528 2.088-1.152 2.904a6.554 6.554 0 0 1-2.592 1.968c-1.056.48-2.232.72-3.504.72-1.488 0-2.856-.312-4.104-.984Zm15.956.168a5.435 5.435 0 0 1-2.208-2.208c-.552-.912-.816-1.992-.816-3.216 0-1.2.264-2.28.816-3.216a6.147 6.147 0 0 1 2.208-2.232c.936-.528 2.016-.792 3.216-.792 1.2 0 2.28.264 3.216.792.936.576 1.68 1.32 2.208 2.232.528.936.792 2.016.792 3.216 0 1.2-.264 2.28-.792 3.216-.528.96-1.272 1.68-2.208 2.208-.936.552-2.016.816-3.216.816-1.224 0-2.304-.264-3.216-.816Zm6-2.4c.696-.792 1.056-1.8 1.056-3.024 0-1.2-.36-2.208-1.056-3.024-.72-.768-1.656-1.176-2.784-1.176-1.176 0-2.112.408-2.784 1.176-.72.792-1.08 1.8-1.08 3.024s.36 2.232 1.08 3.024c.672.792 1.608 1.176 2.784 1.176 1.128 0 2.064-.384 2.784-1.176Zm8.039-9.072V22h-2.328V9.904h2.328Zm.12-2.136h-2.592V4.84h2.592v2.928Zm5.153 4.272a3.54 3.54 0 0 1 1.512-1.728c.648-.384 1.44-.6 2.376-.6 1.344 0 2.424.456 3.288 1.344.816.888 1.224 2.064 1.224 3.504V22H78.38v-6.984c0-.936-.264-1.704-.768-2.328-.528-.576-1.224-.888-2.064-.888-.96 0-1.752.36-2.328 1.032-.624.72-.912 1.584-.912 2.616V22H69.98V9.904h2.328v2.136Zm10.303-2.136h2.472V8.728c0-1.2.36-2.136 1.08-2.832.72-.696 1.704-1.056 2.904-1.056h1.992v2.016h-1.824c-.576 0-1.032.192-1.32.528-.336.36-.504.84-.504 1.416v1.104h3.648v2.016h-3.648V22h-2.328V11.92h-2.472V9.904Zm18.855 9.96a3.615 3.615 0 0 1-1.488 1.728c-.696.408-1.488.6-2.4.6-1.368 0-2.448-.432-3.264-1.344-.84-.864-1.248-2.04-1.248-3.504v-7.44h2.328v6.984c0 .96.264 1.728.792 2.328.48.6 1.176.888 2.04.888.96 0 1.728-.336 2.328-1.032.6-.696.912-1.56.912-2.616V9.904h2.328V22h-2.328v-2.136Zm7.639-7.824a3.54 3.54 0 0 1 1.512-1.728c.648-.384 1.44-.6 2.376-.6 1.344 0 2.424.456 3.288 1.344.816.888 1.224 2.064 1.224 3.504V22h-2.328v-6.984c0-.936-.264-1.704-.768-2.328-.528-.576-1.224-.888-2.064-.888-.96 0-1.752.36-2.328 1.032-.624.72-.912 1.584-.912 2.616V22h-2.328V9.904h2.328v2.136Zm13.375 9.336c-.864-.504-1.536-1.248-1.992-2.208-.48-.96-.696-2.016-.696-3.216 0-1.2.216-2.28.696-3.24a5.193 5.193 0 0 1 1.992-2.208c.864-.528 1.896-.792 3.096-.792.816 0 1.56.192 2.256.528.696.36 1.224.84 1.584 1.44V4.84h2.328V22h-2.328v-1.8c-.36.6-.888 1.08-1.584 1.44-.672.384-1.416.552-2.232.552-1.248 0-2.28-.264-3.12-.816ZM128.576 19c.672-.768 1.008-1.776 1.008-3.048 0-1.248-.336-2.28-1.008-3.048-.696-.768-1.608-1.152-2.712-1.152-1.128 0-2.016.384-2.688 1.152-.672.768-1.008 1.8-1.008 3.048 0 1.272.336 2.28 1.008 3.048.672.768 1.56 1.152 2.688 1.152 1.104 0 2.016-.384 2.712-1.152Zm7.024 2.064c-.912-.744-1.392-1.752-1.44-3h2.184c.048.696.336 1.224.816 1.608.48.384 1.104.576 1.896.576.648 0 1.2-.144 1.656-.48.408-.312.624-.696.624-1.152 0-.432-.12-.792-.36-1.032a3.52 3.52 0 0 0-.936-.528 10.377 10.377 0 0 0-.672-.144c-.264-.048-.552-.096-.864-.168-.864-.144-1.56-.312-2.088-.504-.552-.144-1.008-.48-1.368-.984-.384-.48-.576-1.152-.576-2.064 0-1.008.384-1.848 1.2-2.52.768-.624 1.8-.96 3.096-.96 1.368 0 2.472.36 3.336 1.032.84.696 1.296 1.608 1.392 2.76h-2.184c-.072-.624-.36-1.104-.888-1.464-.528-.312-1.08-.48-1.656-.48-.624 0-1.128.144-1.512.432-.384.288-.576.672-.576 1.128 0 .576.216.96.672 1.152.432.216 1.104.384 2.016.504.864.12 1.608.288 2.184.48.528.192 1.008.552 1.44 1.056.384.528.6 1.272.6 2.256 0 1.104-.408 1.992-1.224 2.64-.864.672-1.968.984-3.312.984-1.416 0-2.568-.36-3.456-1.128Z"
        />
      </svg>
    );
  },
};

export default Icons;
