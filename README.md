# react-native-scrollable-tabs

This is a package for implementing scrollable tabs such as AirBnb filter tabs

## Installation

```sh
yarn add @matejpekar/react-native-scrollable-tabs
```

or

```sh
npm install @matejpekar/react-native-scrollable-tabs
```

## Usage

```js
import ScrollableTabs, {
  ScrollIndicator,
} from '@matejpekar/react-native-scrollable-tabs';

// ...

export default () => {
  const { width } = useWindowDimensions();

  return (
    <ScrollableTabs width={width} scrollIndicator={<ScrollIndicator />}>
      <Tab />
      // ...
    </ScrollableTabs>
  );
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
