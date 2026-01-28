import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter(x => x);

  const nameMap = {
    dashboard: "Dashboard",
    product: "Product",
    cart: "My Cart",
    checkout: "Checkout",
    "my-orders": "My Orders",
    profile: "Profile"
  };

  return (
    <div style={{ marginBottom: 15, fontSize: 14 }}>
      <Link to="/dashboard">Dashboard</Link>

      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        // hide UUIDs
        if (value.length > 20) return null;

        return (
          <span key={to}>
            {" > "}
            {isLast ? (
              <span>{nameMap[value] || value}</span>
            ) : (
              <Link to={to}>{nameMap[value] || value}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
