import { Component } from "react";
import Box from "@mui/material/Box";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false }; // ganti
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("PokemonCard error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          role="alert"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px",
            borderRadius: "12px",
            background: "var(--bg-poke-card)",
            border: "1px solid var(--border)",
            minHeight: "140px",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          <span>Oh no! The Pokémon broke out of the ball (ᗒᗣᗕ)՞</span>
        </Box>
      );
    }
    return this.props.children;
  }
}
