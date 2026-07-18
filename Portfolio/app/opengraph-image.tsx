import { ImageResponse } from "next/og";

export const alt =
  "Harsh Carpenter — I ship production software, systems real businesses run on.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(90% 70% at 75% 15%, #1c1c22 0%, #0a0a0b 60%)",
          color: "#f4f4f5",
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            border: "2px solid #232327",
            padding: "48px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            <span>Harsh Carpenter</span>
            <span style={{ color: "#9ba0a6" }}>Full Stack Developer</span>
          </div>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.02,
              textTransform: "uppercase",
              letterSpacing: -1,
            }}
          >
            <span>I ship production</span>
            <span>software — systems</span>
            <span style={{ color: "#ff4d00" }}>businesses run on.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 44,
              gap: 24,
              alignItems: "center",
            }}
          >
            <span
              style={{
                border: "3px solid #ff4d00",
                color: "#ff4d00",
                padding: "10px 18px",
                fontSize: 24,
                letterSpacing: 5,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              In production
            </span>
            <span style={{ fontSize: 24, color: "#9ba0a6", letterSpacing: 3 }}>
              Hospital SaaS · Exam platforms · AI systems
            </span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
