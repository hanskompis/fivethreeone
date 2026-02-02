# FiveThreeOne 💪

A React Native app for calculating training weights based on Jim Wendler's 5/3/1 strength program.

## Features

- Comic-style animated splash screen
- Input fields for 4 main lifts (Bench, Squat, OHP, Deadlift)
- Calculates 4-week training cycles with proper percentages
- Weight rounding to practical plate increments
- Supports kg and lbs units

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Quality Checks

Run quality checks before committing:

```bash
# Run ESLint
make lint-frontend

# Run TypeScript type-check + ESLint
make sast-frontend

# Run Jest tests
make test-frontend

# Run all checks
make all-checks

# Run tests with coverage
make test-coverage
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
