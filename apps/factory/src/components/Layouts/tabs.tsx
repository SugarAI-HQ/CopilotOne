export function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}
