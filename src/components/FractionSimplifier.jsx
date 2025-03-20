import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const FractionSimplifier = () => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [gcdSteps, setGcdSteps] = useState([]);
  const [currentGcdStepIndex, setCurrentGcdStepIndex] = useState(-1);
  const [showAllGcdSteps, setShowAllGcdSteps] = useState(false);
  const [gcdInputs, setGcdInputs] = useState({});
  const [gcdInputErrors, setGcdInputErrors] = useState({});
  const [isNextStepLocked, setIsNextStepLocked] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [simplifiedNum, setSimplifiedNum] = useState(0);
  const [simplifiedDen, setSimplifiedDen] = useState(0);
  const [finalRepresentation, setFinalRepresentation] = useState('');

  const handleNumeratorChange = (e) => {
    const value = e.target.value;
    // Reject non-numeric characters
    if (value === '' || /^[0-9]+$/.test(value)) {
      // Only allow positive integers up to 1000
      if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 1000)) {
        setNumerator(value);
      }
    }
  };

  const handleDenominatorChange = (e) => {
    const value = e.target.value;
    // Reject non-numeric characters
    if (value === '' || /^[0-9]+$/.test(value)) {
      // Only allow positive integers up to 1000
      if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 1000)) {
        setDenominator(value);
      }
    }
  };

  const gcdWithSteps = (a, b) => {
    const steps = [];
    let x = Math.max(Math.abs(a), Math.abs(b));
    let y = Math.min(Math.abs(a), Math.abs(b));
    
    while (y !== 0) {
      const quotient = Math.floor(x / y);
      const remainder = x % y;
      
      steps.push({
        x: x,
        y: y,
        quotient: quotient,
        remainder: remainder
      });
      
      x = y;
      y = remainder;
    }
    
    return { gcd: x, steps: steps };
  };

  const [displayedNumerator, setDisplayedNumerator] = useState('');
  const [displayedDenominator, setDisplayedDenominator] = useState('');

  const handleSimplify = () => {
    // Basic validation
    if (!numerator || !denominator) {
      return;
    }
    
    const num = parseInt(numerator);
    const den = parseInt(denominator);
    
    if (isNaN(num) || isNaN(den) || den === 0) {
      return;
    }
    
    // Store the current values for display
    setDisplayedNumerator(num);
    setDisplayedDenominator(den);

    const { gcd, steps: gcdCalcSteps } = gcdWithSteps(num, den);
    const simplifiedN = num / gcd;
    const simplifiedD = den / gcd;
    
    // Store the simplified values in state
    setSimplifiedNum(simplifiedN);
    setSimplifiedDen(simplifiedD);
    
    // Determine the final representation (proper fraction, mixed number, or whole number)
    let finalRep = '';
    if (simplifiedN === simplifiedD) {
      // Case: Equal numerator and denominator (e.g., 5/5 = 1)
      finalRep = `${simplifiedN}/${simplifiedD} = 1`;
    } else if (simplifiedN % simplifiedD === 0) {
      // Case: Numerator is a multiple of denominator (e.g., 10/5 = 2)
      finalRep = `${simplifiedN}/${simplifiedD} = ${simplifiedN / simplifiedD}`;
    } else if (simplifiedN > simplifiedD) {
      // Case: Improper fraction to mixed number (e.g., 7/3 = 2 1/3)
      const wholeNumber = Math.floor(simplifiedN / simplifiedD);
      const newNumerator = simplifiedN - (wholeNumber * simplifiedD);
      finalRep = `${simplifiedN}/${simplifiedD} = ${wholeNumber} ${newNumerator}/${simplifiedD}`;
    } else {
      // Case: Proper fraction (e.g., 3/5)
      finalRep = `${simplifiedN}/${simplifiedD}`;
    }
    
    // Store in state
    setFinalRepresentation(finalRep);

    setSteps([
      `Step 1: Find the Greatest Common Divisor (GCD) of ${num} and ${den} using the Euclidean division method:`,
      `Step 2: Divide both the numerator and denominator by the GCD (${gcd}):
${num} ÷ ${gcd} = ${simplifiedN}
${den} ÷ ${gcd} = ${simplifiedD}`,
      `Step 3: Write the simplified fraction in its final form:`,
      `Step 4: Simplification Complete!`
    ]);
    
    setGcdSteps(gcdCalcSteps);
    setCurrentStepIndex(0);
    setShowResults(true);
  };

  return (
    <div className="w-full max-w-md mx-auto shadow-md bg-white rounded-lg overflow-hidden">
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="flex flex-col space-y-1">
            <label htmlFor="fractionInput" className="block text-sm font-medium text-gray-700">Fraction to simplify:</label>
            <div className="flex space-x-2">
              <input
                id="numeratorInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={numerator}
                onChange={handleNumeratorChange}
                placeholder="Numerator"
                className="w-full text-base p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                id="denominatorInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={denominator}
                onChange={handleDenominatorChange}
                placeholder="Denominator"
                className="w-full text-base p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSimplify}
                className="px-2 bg-green-500 hover:bg-green-600 text-white text-sm py-1 rounded-md transition-colors"
              >
                Simplify
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showResults && (
        <div className="p-3 flex flex-col items-start bg-gray-50 rounded-b-lg space-y-2">
          <div className="w-full">
            <h3 className="text-blue-700 text-sm font-medium mb-2">
              Steps to simplify the fraction ({displayedNumerator}/{displayedDenominator}):
            </h3>
            
            <div className="space-y-4">
                <div className="w-full p-2 mb-1 bg-white border border-blue-200 rounded-md">
                  {currentStepIndex === 0 ? (
                    <p className="text-sm whitespace-pre-line">{steps[currentStepIndex]}</p>
                  ) : currentStepIndex === 3 ? (
                    <>
                      <p className="text-sm">{steps[currentStepIndex]}</p>
                      <div className="flex justify-center items-center mt-2">
                        <div className="text-green-600 text-center">
                          {/* For improper fractions, show both representations */}
                          {simplifiedNum > simplifiedDen && simplifiedNum % simplifiedDen !== 0 ? (
                            <div className="flex items-center">
                              {/* Improper fraction */}
                              <div className="flex flex-col items-center justify-center">
                                <div className="text-xl font-bold">{simplifiedNum}</div>
                                <div className="border-t border-green-600 w-12 my-1"></div>
                                <div className="text-xl font-bold">{simplifiedDen}</div>
                              </div>
                              
                              {/* Separator */}
                              <div className="mx-3 text-gray-700">or</div>
                              
                              {/* Mixed number */}
                              <div className="flex items-center">
                                <div className="text-xl font-bold mr-2">
                                  {Math.floor(simplifiedNum / simplifiedDen)}
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                  <div className="text-xl font-bold">{simplifiedNum % simplifiedDen}</div>
                                  <div className="border-t border-green-600 w-12 my-1"></div>
                                  <div className="text-xl font-bold">{simplifiedDen}</div>
                                </div>
                              </div>
                            </div>
                          ) : simplifiedDen === 1 ? (
                            /* When denominator is 1, show only the whole number */
                            <div className="text-xl font-bold">
                              {simplifiedNum}
                            </div>
                          ) : (
                            /* For proper fractions, whole numbers, or equal fractions, just show the one form */
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-xl font-bold">{simplifiedNum}</div>
                              <div className="border-t border-green-600 w-12 my-1"></div>
                              <div className="text-xl font-bold">{simplifiedDen}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : currentStepIndex === 2 ? (
                    <>
                      <p className="text-sm">{steps[currentStepIndex].split('\n')[0]}</p>
                      <div className="mt-2 flex justify-center">
                        <div className="text-blue-700">
                          <div className="flex items-center">
                            {finalRepresentation.includes('=') ? (
                              <>
                                <div className="flex flex-col items-center mr-3">
                                  <div className="text-lg font-medium">{simplifiedNum}</div>
                                  <div className="border-t border-blue-700 w-8 my-1"></div>
                                  <div className="text-lg font-medium">{simplifiedDen}</div>
                                </div>
                                <div className="mx-2">=</div>
                                {simplifiedNum === simplifiedDen ? (
                                  <div className="text-lg font-medium">1</div>
                                ) : simplifiedNum % simplifiedDen === 0 ? (
                                  <div className="text-lg font-medium">{simplifiedNum / simplifiedDen}</div>
                                ) : simplifiedNum > simplifiedDen ? (
                                  <div className="flex items-center">
                                    <div className="text-lg font-medium mr-2">
                                      {Math.floor(simplifiedNum / simplifiedDen)}
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="text-lg font-medium">{simplifiedNum % simplifiedDen}</div>
                                      <div className="border-t border-blue-700 w-8 my-1"></div>
                                      <div className="text-lg font-medium">{simplifiedDen}</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-lg font-medium">
                                    {finalRepresentation.split('=')[1].trim()}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="text-lg font-medium">{simplifiedNum}</div>
                                <div className="border-t border-blue-700 w-8 my-1"></div>
                                <div className="text-lg font-medium">{simplifiedDen}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">{steps[currentStepIndex].split('\n')[0]}</p>
                      <div className="ml-4 mt-1">
                        {steps[currentStepIndex].split('\n').slice(1).map((line, i) => (
                          <p key={i} className="text-sm">{line}</p>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {currentStepIndex === 0 && (
                    <div className="font-mono mt-2 space-y-1 p-2 bg-blue-50 rounded-md">
                      {gcdSteps.map((gcdStep, i) => (
                        <div key={i} className="text-xs">
                          <p className="font-medium text-blue-700">
                            {i === 0 ? "First, divide the larger number by the smaller:" : 
                             "Next, divide the previous divisor by the remainder:"}
                          </p>
                          <p className="ml-2">
                            {gcdStep.x} ÷ {gcdStep.y} = {gcdStep.quotient} with remainder {gcdStep.remainder}
                          </p>
                          {i === gcdSteps.length - 1 && gcdStep.remainder === 0 && (
                            <p className="mt-1 text-green-700 font-medium">
                              Since the remainder is 0, the GCD is the last divisor: {gcdStep.y}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="w-24 p-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-500">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === steps.length - 1}
                    className="w-24 p-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FractionSimplifier;