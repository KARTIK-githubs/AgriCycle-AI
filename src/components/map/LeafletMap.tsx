import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ResourceEntity } from '../../data/seedResources';
import { useLanguage } from '../../context/LanguageContext';

interface LeafletMapProps {
  resources: ResourceEntity[];
  farmCentroid: [number, number];
  farmLabel: string;
  farmLabelHi?: string;
  selectedResourceId?: string | null;
  focusResourceId?: string | null;
  onSelectResource?: (resourceId: string) => void;
  heightClass?: string;
}

// Generate custom SVG icons to avoid Leaflet asset bundling issues
function createFarmMarkerIcon(label: string): L.DivIcon {
  return L.divIcon({
    className: 'agri-custom-marker farm-marker',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -42],
    html: `
      <div class="relative flex flex-col items-center group cursor-pointer">
        <div class="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-amber-500/40 transform transition hover:scale-110">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div class="w-2 h-2 bg-amber-600 rotate-45 -mt-1 shadow-sm"></div>
        <div class="absolute -bottom-5 bg-amber-900/90 text-parchment text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap pointer-events-none">
          ${label}
        </div>
      </div>
    `,
  });
}

function createResourceMarkerIcon(
  resource: ResourceEntity,
  isSelected: boolean
): L.DivIcon {
  let bgClass = 'bg-agri-dark';
  let ringClass = isSelected ? 'ring-4 ring-amber-400 animate-pulse' : 'ring-2 ring-stone-900/10';
  let iconSvg = '';

  switch (resource.type) {
    case 'chc':
      bgClass = isSelected ? 'bg-agri-primary' : 'bg-emerald-800';
      iconSvg = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="6" cy="19" r="2"></circle>
          <circle cx="18" cy="19" r="2"></circle>
          <path d="M6 17h12"></path>
          <path d="M6 17l2-9h6l3 9"></path>
          <path d="M12 8V4"></path>
        </svg>
      `;
      break;
    case 'baler_operator':
      bgClass = isSelected ? 'bg-amber-700' : 'bg-amber-800';
      iconSvg = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <line x1="3" y1="14" x2="21" y2="14"></line>
        </svg>
      `;
      break;
    case 'biomass_aggregator':
      bgClass = isSelected ? 'bg-orange-800' : 'bg-stone-700';
      iconSvg = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      `;
      break;
    case 'pellet_plant':
      bgClass = isSelected ? 'bg-stone-900' : 'bg-stone-800';
      iconSvg = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 20h20"></path>
          <path d="M6 20V8l6 4V4l8 6v10"></path>
        </svg>
      `;
      break;
  }

  const badgeHtml = isSelected
    ? `<div class="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-stone-900 rounded-full flex items-center justify-center text-[10px] font-black shadow border border-white">✓</div>`
    : '';

  return L.divIcon({
    className: 'agri-custom-marker resource-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -38],
    html: `
      <div class="relative flex flex-col items-center cursor-pointer group">
        <div class="w-8 h-8 rounded-full ${bgClass} text-white flex items-center justify-center shadow-md border-2 border-white ${ringClass} transform transition hover:scale-115">
          ${iconSvg}
          ${badgeHtml}
        </div>
        <div class="w-2 h-2 ${bgClass} rotate-45 -mt-1 shadow-sm"></div>
      </div>
    `,
  });
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  resources,
  farmCentroid,
  farmLabel,
  farmLabelHi,
  selectedResourceId,
  focusResourceId,
  onSelectResource,
  heightClass = 'h-[440px] lg:h-[540px]',
}) => {
  const { language } = useLanguage();
  const lang = language;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: farmCentroid,
      zoom: 10,
      scrollWheelZoom: false, // Don't hijack page scroll
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size once rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Popup event listener for interactive resource selection
    map.on('popupopen', (e) => {
      const container = e.popup.getElement();
      if (!container) return;
      const selectBtn = container.querySelector<HTMLButtonElement>('[data-select-resource]');
      if (selectBtn) {
        selectBtn.onclick = (evt) => {
          evt.preventDefault();
          const rId = selectBtn.getAttribute('data-select-resource');
          if (rId && onSelectResource) {
            onSelectResource(rId);
          }
        };
      }
    });

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when resources, centroid, or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const bounds = L.latLngBounds([farmCentroid]);

    // 1. Add Farm Centroid Marker
    const farmMarker = L.marker(farmCentroid, {
      icon: createFarmMarkerIcon(lang === 'hi' ? 'खेत' : 'Farm'),
      zIndexOffset: 1000,
    }).addTo(map);

    const farmPopupContent = `
      <div class="p-2 font-sans text-stone-900 leading-snug">
        <div class="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-amber-700">
          <span>📍</span>
          <span>${lang === 'hi' ? 'आपका खेत (केंद्र)' : 'Your Farm Location'}</span>
        </div>
        <div class="text-sm font-bold font-serif mt-1">
          ${lang === 'hi' && farmLabelHi ? farmLabelHi : farmLabel}
        </div>
        <p class="text-xs text-stone-600 mt-1">
          ${
            lang === 'hi'
              ? 'दूरी व यात्रा समय की गणना इस संदर्भ बिंदु से की जाती है।'
              : 'All logistics and resource distances are calculated from this reference point.'
          }
        </p>
      </div>
    `;
    farmMarker.bindPopup(farmPopupContent);
    markersRef.current.set('farm', farmMarker);

    // 2. Add Resource Markers
    resources.forEach((resource) => {
      const isSelected = selectedResourceId === resource.id;
      const icon = createResourceMarkerIcon(resource, isSelected);

      const marker = L.marker(resource.coordinates, {
        icon,
        zIndexOffset: isSelected ? 900 : 500,
      }).addTo(map);

      // Category label
      let categoryLabel = 'Machinery Centre';
      if (resource.type === 'chc') categoryLabel = lang === 'hi' ? 'कस्टम हायरिंग सेंटर' : 'Custom Hiring Centre';
      if (resource.type === 'baler_operator') categoryLabel = lang === 'hi' ? 'बेलर ऑपरेटर' : 'Baler Operator';
      if (resource.type === 'biomass_aggregator') categoryLabel = lang === 'hi' ? 'बायोमास केंद्र' : 'Biomass Aggregator';
      if (resource.type === 'pellet_plant') categoryLabel = lang === 'hi' ? 'बायो-पैलेट संयंत्र' : 'Bio-Pellet Plant';

      const verifyBadge =
        resource.verificationStatus === 'verified_public'
          ? `<span class="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">${
              lang === 'hi' ? 'सत्यापित सार्वजनिक केंद्र' : 'Verified Public Listing'
            }</span>`
          : `<span class="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-stone-100 text-stone-700 border border-stone-300">${
              lang === 'hi' ? 'डेमो संसाधन (नमूना)' : 'Demo Resource (Sample)'
            }</span>`;

      const equipmentListHtml = resource.equipmentAvailable
        .slice(0, 3)
        .map((eq) => `<li class="text-[11px] text-stone-700">• ${eq}</li>`)
        .join('');

      // Phone link or honest missing notice
      const phoneHtml = resource.contactPhone
        ? `<div class="mt-1 flex items-center gap-1.5 text-xs text-agri-dark font-medium">
             <span>📞</span>
             <a href="tel:${resource.contactPhone}" class="hover:underline font-semibold tracking-wide">${resource.contactPhone}</a>
             <span class="text-[10px] text-stone-500">(${resource.contactPerson})</span>
           </div>`
        : `<div class="mt-1 text-[11px] text-stone-500 italic">
             ${lang === 'hi' ? 'डेमो डेटासेट में संपर्क नंबर उपलब्ध नहीं है' : 'Contact info not available in demo dataset'}
           </div>`;

      const actionButtonHtml = isSelected
        ? `<div class="mt-2.5 py-1 px-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded text-center text-xs font-bold">
             ✓ ${lang === 'hi' ? 'कार्य योजना हेतु चयनित' : 'Selected for Action Plan'}
           </div>`
        : `<button data-select-resource="${resource.id}" class="mt-2.5 w-full py-1 px-3 bg-agri-dark hover:bg-agri-primary text-parchment text-xs font-semibold rounded shadow-sm transition-colors text-center">
             ${lang === 'hi' ? 'इस केंद्र का चयन करें' : 'Select This Resource'}
           </button>`;

      const popupHtml = `
        <div class="p-2 font-sans text-stone-900 max-w-[260px] leading-snug">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-agri-primary">${categoryLabel}</span>
            ${verifyBadge}
          </div>
          <div class="text-sm font-bold font-serif text-stone-900">
            ${lang === 'hi' ? resource.nameHi : resource.name}
          </div>
          <div class="text-xs text-stone-600 mt-0.5">
            📍 ${resource.village}, ${resource.district}
          </div>
          <div class="mt-1.5 pt-1.5 border-t border-stone-200">
            <div class="text-[11px] font-bold text-stone-700 mb-0.5">${lang === 'hi' ? 'उपलब्ध मशीनरी:' : 'Available Equipment:'}</div>
            <ul class="space-y-0.5 mb-1.5">
              ${equipmentListHtml}
            </ul>
            <div class="text-[11px] text-stone-600 bg-stone-50 p-1 rounded border border-stone-200">
              <span class="font-bold">${lang === 'hi' ? 'दर मानक:' : 'Benchmark Rate:'}</span> ${resource.baseRateBenchmark}
            </div>
            ${phoneHtml}
            ${actionButtonHtml}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      bounds.extend(resource.coordinates);
      markersRef.current.set(resource.id, marker);
    });

    // Fit bounds if we have resources
    if (resources.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    }
  }, [resources, farmCentroid, selectedResourceId, lang]);

  // Handle focusResourceId triggers (from card "View on Map" clicks)
  useEffect(() => {
    if (!focusResourceId || !mapInstanceRef.current) return;
    const marker = markersRef.current.get(focusResourceId);
    if (marker) {
      const latLng = marker.getLatLng();
      mapInstanceRef.current.flyTo(latLng, 12, { animate: true, duration: 0.5 });
      const timer = setTimeout(() => {
        marker.openPopup();
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [focusResourceId]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([farmCentroid]);
    resources.forEach((r) => bounds.extend(r.coordinates));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
  };

  const handleCenterFarm = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(farmCentroid, 11, { animate: true, duration: 0.6 });
  };

  return (
    <div className="relative w-full rounded border border-stone-300 shadow-sm overflow-hidden bg-parchment-subtle">
      {/* Map Header Status / Quick Controls */}
      <div className="absolute top-2.5 right-2.5 z-[1000] flex items-center gap-1.5 bg-parchment/95 backdrop-blur-sm px-2 py-1.5 rounded border border-stone-300 shadow-sm">
        <button
          type="button"
          onClick={handleCenterFarm}
          title={lang === 'hi' ? 'फार्म पर जाएं' : 'Center on Farm'}
          className="text-xs font-medium text-stone-700 hover:text-agri-dark px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-300"
        >
          {lang === 'hi' ? '🌾 फार्म' : '🌾 Farm'}
        </button>
        <button
          type="button"
          onClick={handleResetView}
          title={lang === 'hi' ? 'सभी केंद्र देखें' : 'Fit All Resources'}
          className="text-xs font-medium text-stone-700 hover:text-agri-dark px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-300"
        >
          {lang === 'hi' ? '🗺️ सभी देखें' : '🗺️ Fit All'}
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      {/* Map Legend Bar */}
      <div className="px-3 py-2 bg-stone-100/95 border-t border-stone-300 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider">
            {lang === 'hi' ? 'संकेतक:' : 'Legend:'}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-600 inline-block border border-white"></span>
            <span className="text-[11px]">{lang === 'hi' ? 'आपका खेत' : 'Your Farm'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-800 inline-block border border-white"></span>
            <span className="text-[11px]">{lang === 'hi' ? 'कस्टम हायरिंग सेंटर (CHC)' : 'CHC / Machinery'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-800 inline-block border border-white"></span>
            <span className="text-[11px]">{lang === 'hi' ? 'बेलर ऑपरेटर' : 'Baler Operator'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-stone-800 inline-block border border-white"></span>
            <span className="text-[11px]">{lang === 'hi' ? 'बायोमास / पैलेट संयंत्र' : 'Biomass / Pellet'}</span>
          </div>
        </div>
        <div className="text-[10px] text-stone-500 italic">
          {lang === 'hi'
            ? 'दूरी अनुमानित है • वास्तविक सड़क मार्ग भिन्न हो सकता है'
            : 'Distances are approximate straight-line estimates'}
        </div>
      </div>
    </div>
  );
};
