# Payment Cycles Example

This example demonstrates how to use the Mozaic SDK for Node.js to manage payment cycles.

## Prerequisites

- Node.js installed
- Mozaic SDK for Node.js installed

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/mozaic-io/sdk-node.git
    ```
2. Navigate to the example directory:
    ```
    cd sdk-node/examples/payment-cycles
    ```
3. Install the dependencies:
    ```
    npm install
    ```

## Usage

1. Configure your environment variables:
    ```
    cp .env.example .env
    ```
    Update the `.env` file with your [Mozaic API credentials](https://app.sandbox.mozaic.io/account/api-keys)

2. Build the example
    ```
    npm run build
    ```

3. Run the example (Pay by Invoice):
    ```
    npm start pay-by-invoice
    ```

4. Run the example (Pay by Stored Payment Method):
    ```
    npm start pay-with-stored-payment-method
    ```

## VisualStudio Code

If you are using VisualStudio Code, you can directly run the examples using the debugger. Select
the example you wish to run (Ctrl-Shift-D) then press F5 so launch the debugger.

## Features

- An example of creating a payment cycle (bulk payment) and funding it with an invoice.
- An example of creating a payment cycle (bulk payment) and funding it with a stored payment method.
- An example of retrieving stored payment methods
- An example of downloading and saving a PDF invoice for a payment cycle.

## License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE.md) file for details.

## Support

If you have any questions or need help, feel free to open an issue on the [GitHub repository](https://github.com/mozaic-io/sdk-node/issues).
