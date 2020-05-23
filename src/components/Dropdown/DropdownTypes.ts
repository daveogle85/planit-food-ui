export type DropdownProps = {
  label: string | React.ComponentType;
  defaultState: string;
  options: Array<string>;
  // Key is an option
  onSelect?: { [key: string]: () => void };
};
