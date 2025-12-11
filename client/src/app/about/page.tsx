"use client";

import Image from "next/image";
import { Box, Typography, Container, Card, CardContent } from "@mui/material";

export default function AboutPage() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        py: 8,
        backgroundImage: "url('/backgrounds/food-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(2px)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Container maxWidth="md">

          {/* HERO SECTION */}
          <Typography
            variant="h3"
            fontWeight="900"
            sx={{
              textAlign: "center",
              mb: 2,
              letterSpacing: "0.5px",
              color: "#008080",
            }}
          >
            About Spark! Bytes
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "text.secondary",
              maxWidth: "80%",
              mx: "auto",
            }}
          >
            A student-built initiative connecting BU students with free food on
            campus — reducing waste, improving access, and creating community.
          </Typography>

          {/* MISSION CARD */}
          <Card
            elevation={6}
            sx={{
              mb: 5,
              borderRadius: 4,
              background: "white",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                fontWeight="700"
                gutterBottom
                sx={{ color: "#008080" }}
              >
                Our Mission
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "black",
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                }}
              >
                Spark! Bytes helps students discover leftover food from events,
                gatherings, and activities across BU. By making this information
                accessible, we reduce food waste and ensure students always have
                access to valuable resources.
              </Typography>
            </CardContent>
          </Card>

          {/* FEATURES CARD */}
          <Card
            elevation={6}
            sx={{
              mb: 8,
              borderRadius: 4,
              background: "white",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                fontWeight="700"
                gutterBottom
                sx={{ color: "#008080" }}
              >
                What You Can Do Here
              </Typography>

              <Box
                sx={{
                  pl: 2,
                  color: "black",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                }}
              >
                <Typography sx={{ mb: 1 }}>• Browse campus food events</Typography>
                <Typography sx={{ mb: 1 }}>• Filter by dietary preferences</Typography>
                <Typography sx={{ mb: 1 }}>• Reserve available food</Typography>
                <Typography sx={{ mb: 1 }}>• Leave feedback</Typography>
                <Typography sx={{ mb: 1 }}>• Organizers can manage events</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* TEAM HEADING */}
          <Typography
            variant="h4"
            fontWeight="900"
            sx={{
              textAlign: "center",
              mb: 4,
              color: "#008080",
            }}
          >
            Meet the Team
          </Typography>

          {/*  TEAM GRID — Bigger profiles, still one row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 180px)", //  bigger cards
              gap: 3,
              justifyContent: "center",
              width: "100%",
              mb: 6,
            }}
          >
            {[
              { name: "Oumou Diallo", role: "CS 2026", img: "/team/oumou.jpg" },
              { name: "Aryam Mebrahtu", role: "CS 2027", img: "/team/aryam.jpg" },
              { name: "Ziyang Li", role: "CS 2026", img: "/team/ziyang.jpg" },
              { name: "Liam Yates", role: "CS 2027", img: "/team/liam.jpg" },
              { name: "Abdullah Kutbi", role: "CS 2025", img: "/team/abdullah.jpg" },
            ].map((member) => (
              <Card
                key={member.name}
                elevation={4}
                sx={{
                  width: 180,              //  bigger card
                  borderRadius: 3,
                  textAlign: "center",
                  p: 2.5,
                  background: "white",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={100}           
                    height={100}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #008080",
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight="700"
                  sx={{ fontSize: "1rem" }}
                >
                  {member.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.8rem" }}
                >
                  {member.role}
                </Typography>
              </Card>
            ))}
          </Box>

          {/* FOOTER */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, textAlign: "center" }}
          >
            Built with ❤️ by the Spark! Bytes Team.
          </Typography>

        </Container>
      </Box>
    </Box>
  );
}
