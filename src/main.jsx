import React from 'react'
import ReactDOM from 'react-dom/client'
import * as AppModule from './App.jsx'

const App = AppModule.default || AppModule.TunzCarsApp || Object.values(AppModule)[0]

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
