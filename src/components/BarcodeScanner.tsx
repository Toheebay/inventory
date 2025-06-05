
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeScanned }) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleManualScan = () => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualScan();
    }
  };

  const generateRandomBarcode = () => {
    const barcode = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    setManualBarcode(barcode.toString());
  };

  // Simulate camera scanning
  const simulateCameraScan = () => {
    setIsScanning(true);
    
    // Sample barcodes from our existing products
    const sampleBarcodes = [
      '1234567890123',
      '1234567890124',
      '1234567890125',
      '2234567890123',
      '2234567890124',
    ];
    
    setTimeout(() => {
      const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
      onBarcodeScanned(randomBarcode);
      setIsScanning(false);
      toast({
        title: "Barcode Scanned",
        description: `Scanned barcode: ${randomBarcode}`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Camera Scanner Simulation */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📱 Camera Scanner</h3>
          <p className="text-gray-600 mb-6">Use your device camera to scan product barcodes</p>
          
          {/* Camera View Simulation */}
          <div className="relative w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white">Scanning...</p>
                  
                  {/* Scanning animation overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-2 bg-red-500 opacity-70 animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-6xl text-white mb-4">📷</div>
                  <p className="text-white text-sm">Camera View</p>
                  
                  {/* Viewfinder overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-white border-dashed rounded-lg opacity-50"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={simulateCameraScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? 'Scanning...' : 'Start Camera Scan'}
          </button>
        </div>
      </div>

      {/* Manual Barcode Input */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">⌨️ Manual Entry</h3>
          <p className="text-gray-600 mb-6">Enter barcode manually or use a barcode scanner gun</p>
          
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">📊</span>
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter or scan barcode here..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleManualScan}
                disabled={!manualBarcode.trim()}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search Product
              </button>
              <button
                onClick={generateRandomBarcode}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Random
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Generator/Display */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📋 Sample Barcodes</h3>
          <p className="text-gray-600 mb-6">Click on any barcode to search for the product</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: '1234567890123', name: 'iPhone 15 Pro' },
              { code: '1234567890124', name: 'Samsung Galaxy S24' },
              { code: '1234567890125', name: 'MacBook Air M3' },
              { code: '2234567890123', name: 'Nike Air Max 270' },
              { code: '2234567890124', name: 'Levi\'s 501 Jeans' },
              { code: '3234567890123', name: 'Dyson V15 Detect' },
            ].map((item) => (
              <button
                key={item.code}
                onClick={() => onBarcodeScanned(item.code)}
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 text-left"
              >
                <div className="font-mono text-lg font-bold text-gray-800 mb-1">{item.code}</div>
                <div className="text-sm text-gray-600">{item.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-blue-200/20">
        <h4 className="font-semibold text-blue-800 mb-3">📚 How to Use the Scanner</h4>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Use the camera scanner for real barcode scanning (simulation)</li>
          <li>• Type barcodes manually in the input field</li>
          <li>• Connect a USB barcode scanner and scan directly into the input</li>
          <li>• Click on sample barcodes to test the system</li>
          <li>• Press Enter after typing to search</li>
        </ul>
      </div>
    </div>
  );
};

export default BarcodeScanner;
