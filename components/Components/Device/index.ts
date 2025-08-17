import dynamic from 'next/dynamic';

const Device = dynamic(() => import('./Device'), { ssr: false });

export default Device;

// example of usage in template:
// <Device>
//   {({ isMobile }) => {
//     if (isMobile) return <div>Mobile View</div>;
//     return <div>Desktop View</div>;
//   }}
// </Device>