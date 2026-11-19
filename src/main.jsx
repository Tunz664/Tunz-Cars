import React from 'react'
import ReactDOM from 'react-dom/client'
import * as AppModule from './tunz_cars_fleet_billing_suite.tsx'

const App = AppModule.default || AppModule.TunzCarsApp || Object.values(AppModule)[0]

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
