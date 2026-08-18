import Script from "next/script"

const Analytics = () => {
  if (process.env.NEXT_PUBLIC_ENV !== 'production') {
    return null;
  }
  
  return (
    <>
      {/* `beforeInteractive` wstrzykuje skrypt do dokumentu i odpala go PRZED
          hydracją, na ścieżce krytycznej. Dokumentacja Next.js dla GTM wskazuje
          `afterInteractive` - tag i tak tylko zapisuje do dataLayer, nic w
          pierwszym renderze od niego nie zależy.
          UWAGA: to jest DRUGI kontener GTM na stronie (K6G8DFP), obok
          GTM-P5KBGQN9 z _document.tsx. Patrz raport - prawdopodobnie
          duplikat do usunięcia, ale to decyzja biznesowa, nie techniczna. */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K6G8DFP');
          `,
        }}
      />
    </>
  )
}

export default Analytics;