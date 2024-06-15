// src/svg.d.ts
declare module '*.svg' {
    const content: any;
    export default content;
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  }
  