import "./style/App.scss";

import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { TheMap, TheNavbar, TheTopbar } from "@/components/async";
import WidgetTrack from "@/components/WidgetTrack";
import { routes } from "@/config/routes";
import { builder, layout } from "@/store";
import { usePageSwitch } from "@/util";

const App = () => {
  const layoutComponents = [
    {
      component: TheNavbar,
      key: "navbar",
    },
    {
      component: TheTopbar,
      key: "topbar",
    },
  ];

  const stores = { builder, layout };
  const PageSwitch = () => {
    usePageSwitch();
    return <></>;
  };
  return (
    <div className="App">
      {layout.modules.find((m) => m.id === "map") ? (
        <Suspense fallback={<>...</>}>
          <TheMap layout={layout} key="map" />
        </Suspense>
      ) : null}
      <BrowserRouter>
        {layoutComponents.map((item) => (
          <Suspense fallback={<>...</>} key={item.key}>
            <item.component key={item.key} />
          </Suspense>
        ))}
        <Routes>
          {routes.map((route, key) => (
            <Route
              {...route}
              element={
                <Suspense fallback={<>loading...</>}>
                  <PageSwitch />
                  <route.component />
                </Suspense>
              }
              key={key}
            />
          ))}
        </Routes>
      </BrowserRouter>
      <WidgetTrack side="left" {...stores} />
      <WidgetTrack side="right" {...stores} />
    </div>
  );
};

export default App;
