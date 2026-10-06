"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Property } from "@/lib/properties";
import { buildTenancyRedirect } from "@/lib/tenancy";

function PropertyCard({ p, onOpen }: { p: Property; onOpen: (p: Property) => void }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (p.gallery.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % p.gallery.length);
    }, 3000 + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [p.gallery.length]);

  return (
    <div className="deep-card">
      <div className="fade-img-wrapper" style={{ height: 230 }}>
        {p.status === "Rented" ? (
          <div className="prop-status-rented">Rented</div>
        ) : (
          p.date && <div className="prop-date">Available: {p.date}</div>
        )}
        <Image
          src={p.gallery[idx] ?? p.img}
          alt={p.title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="property-content">
        <div className="prop-price">
          ${p.price} <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>/wk</span>
        </div>
        <h3 className="prop-title">{p.title}</h3>
        <p className="prop-address">{p.suburb}, Auckland</p>
        <div className="prop-features">
          <span>🛏️ {p.beds}</span>
          <span>🛁 {p.baths}</span>
          <span>🚗 {p.carparks}</span>
        </div>
        <div className="prop-tags" style={{ marginTop: "0.5rem" }}>
          <span
            className="prop-tag"
            style={{ color: "var(--success)", borderColor: "var(--success)", fontSize: "0.8rem", fontWeight: 600, padding: "2px 8px", border: "1px solid", borderRadius: 4 }}
          >
            Healthy Homes
          </span>
        </div>
        <button className="btn-outline" onClick={() => onOpen(p)} style={{ marginTop: "auto" }}>
          Book Viewing / Details
        </button>
      </div>
    </div>
  );
}

// "Apply Now" / "Book a Viewing" hand off to Tenancy.co.nz (Phase 2). Hidden
// until the real TPS redirect URL is configured — the link is a placeholder for
// now, so the buttons would be dead links. Flip to true to show them.
const SHOW_TENANCY_ACTIONS = false;

const lightboxArrowStyle: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
  border: "none",
  width: 54,
  height: 54,
  borderRadius: "50%",
  fontSize: "2.2rem",
  lineHeight: 1,
  cursor: "pointer",
  zIndex: 5001,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function PropertyGrid({ properties }: { properties: Property[] }) {
  const [city, setCity] = useState("All");
  const [beds, setBeds] = useState(0);
  const [rent, setRent] = useState(1500);
  const [modalProp, setModalProp] = useState<Property | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const cities = useMemo(() => {
    const set = Array.from(new Set(properties.map((p) => p.city)));
    return set;
  }, [properties]);

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        const matchCity = city === "All" || p.city === city;
        const matchBeds = p.beds >= beds;
        const matchRent = p.price <= rent;
        return matchCity && matchBeds && matchRent;
      }),
    [properties, city, beds, rent]
  );

  const clearFilters = () => {
    setCity("All");
    setBeds(0);
    setRent(1500);
  };

  const navLightbox = (dir: number) =>
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index + dir + lb.images.length) % lb.images.length } : lb
    );

  // Keyboard: Escape closes (lightbox first, then the modal); left/right arrows
  // page through the open lightbox gallery.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === "Escape") setLightbox(null);
        else if (e.key === "ArrowLeft") navLightbox(-1);
        else if (e.key === "ArrowRight") navLightbox(1);
      } else if (e.key === "Escape") {
        setModalProp(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <div className="filter-bar">
        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.6rem", display: "block" }}>
            Select City
          </label>
          <div className="chip-group">
            <button className={`chip${city === "All" ? " active" : ""}`} onClick={() => setCity("All")}>
              All Auckland
            </button>
            {cities
              .filter((c) => c !== "All")
              .map((c) => (
                <button key={c} className={`chip${city === c ? " active" : ""}`} onClick={() => setCity(c)}>
                  {c}
                </button>
              ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Bedrooms</label>
            <select className="form-control" value={beds} onChange={(e) => setBeds(parseInt(e.target.value))}>
              <option value="0">Any Bedrooms</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>
              Max Weekly Rent: ${rent}/wk
            </label>
            <input
              type="range"
              min={400}
              max={1500}
              step={50}
              value={rent}
              onChange={(e) => setRent(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-gold)", cursor: "pointer" }}
            />
          </div>
          <div>
            <button
              className="btn-primary"
              onClick={clearFilters}
              style={{ background: "transparent", border: "1.5px solid var(--text-primary)", color: "var(--text-primary)", width: "100%" }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem", fontWeight: 600, color: "var(--text-secondary)" }}>
        Showing {filtered.length} of {properties.length} Properties
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          No rental properties match this exact filter criteria. Contact us for upcoming unlisted homes.
        </div>
      ) : (
        <div className="property-grid">
          {filtered.map((p) => (
            <PropertyCard key={p.id} p={p} onOpen={setModalProp} />
          ))}
        </div>
      )}

      {/* Property detail modal */}
      <div
        className={`modal-overlay${modalProp ? " active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalProp(null);
        }}
      >
        {modalProp && (
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 style={{ fontSize: "1.8rem", color: "var(--accent-gold)" }}>{modalProp.title}</h3>
              <button onClick={() => setModalProp(null)} style={{ fontSize: "2rem", lineHeight: 1, color: "var(--text-muted)" }} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ color: "var(--accent-gold)", fontSize: "2.5rem", margin: 0 }}>
                  ${modalProp.price} <span style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>/ week</span>
                </h2>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 600, fontSize: "1.1rem", margin: 0, paddingBottom: "0.2rem" }}>{modalProp.suburb}, Auckland</p>
                  {modalProp.status === "Rented" ? (
                    <p style={{ color: "#fff", background: "var(--accent-gold)", fontWeight: 700, margin: 0, padding: "6px 12px", borderRadius: 4, display: "inline-block", fontSize: "0.85rem", letterSpacing: 1 }}>Rented</p>
                  ) : (
                    <p style={{ color: "var(--success)", fontWeight: 600, margin: 0 }}>Available: {modalProp.date}</p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem", fontSize: "1.2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <span>🛏️ {modalProp.beds} Bedrooms</span>
                <span>🛁 {modalProp.baths} Bathrooms</span>
                <span>🚗 {modalProp.carparks} Parking spaces</span>
              </div>

              <div style={{ position: "relative", width: "100%", height: 400, marginBottom: "2rem", borderRadius: 8, overflow: "hidden", cursor: "pointer" }} onClick={() => setLightbox({ images: modalProp.gallery.length ? modalProp.gallery : [modalProp.img], index: 0 })}>
                <Image src={modalProp.img} alt={modalProp.title} fill sizes="(max-width: 900px) 100vw, 900px" style={{ objectFit: "cover" }} />
              </div>

              <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "2rem" }}>
                Beautifully maintained and fully compliant with Healthy Homes Standards. This exceptional rental in {modalProp.suburb} offers unparalleled comfort and convenience. Managed professionally by Rent Worx.
              </p>

              {modalProp.gallery.length > 0 && (
                <div className="gallery-grid">
                  {modalProp.gallery.map((src, i) => (
                    <div key={i} style={{ position: "relative", height: 150, borderRadius: 8, overflow: "hidden", cursor: "pointer" }} onClick={() => setLightbox({ images: modalProp.gallery, index: i })}>
                      <Image src={src} alt="Property gallery image" fill sizes="200px" style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Phase 2 — Tenancy.co.nz handoff (securely redirects; no PII stored locally).
                  Hidden until the real TPS redirect URL is configured (placeholder for now). */}
              {SHOW_TENANCY_ACTIONS && (
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2.5rem" }}>
                  <a href={buildTenancyRedirect(modalProp.id, "apply")} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Apply Now
                  </a>
                  <a href={buildTenancyRedirect(modalProp.id, "viewing")} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ width: "auto", padding: "0.8rem 1.8rem" }}>
                    Book a Viewing
                  </a>
                </div>
              )}

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <Link href="/contact" className="btn-nav" onClick={() => setModalProp(null)}>
                  Contact Agent
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox with Prev/Next navigation (click backdrop or × to close). */}
      <div className={`lightbox${lightbox ? " active" : ""}`} onClick={() => setLightbox(null)}>
        {lightbox && (
          <>
            <span className="lightbox-close" onClick={(e) => { e.stopPropagation(); setLightbox(null); }}>×</span>

            {lightbox.images.length > 1 && (
              <button aria-label="Previous image" style={{ ...lightboxArrowStyle, left: "2rem" }} onClick={(e) => { e.stopPropagation(); navLightbox(-1); }}>
                ‹
              </button>
            )}

            <Image
              src={lightbox.images[lightbox.index]}
              alt="Enlarged view"
              width={1400}
              height={933}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "auto", height: "auto", maxWidth: "88%", maxHeight: "88%", objectFit: "contain", borderRadius: 8 }}
            />

            {lightbox.images.length > 1 && (
              <button aria-label="Next image" style={{ ...lightboxArrowStyle, right: "2rem" }} onClick={(e) => { e.stopPropagation(); navLightbox(1); }}>
                ›
              </button>
            )}

            {lightbox.images.length > 1 && (
              <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", color: "#fff", background: "rgba(0,0,0,0.55)", padding: "0.4rem 1rem", borderRadius: 20, fontSize: "0.9rem", fontWeight: 600, zIndex: 5001 }}>
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
