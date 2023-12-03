export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "Dashboard",
        route: "/dashboard",
        bootstrapIcon: "bi-house",
      },
      {
        heading: "Analysis",
        route: "/server-transaction",
        bootstrapIcon: "bi-graph-up",
      }
    ],
  },
];

export default MainMenuConfig;
