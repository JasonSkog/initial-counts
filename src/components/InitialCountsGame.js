import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, Heart, Share2, ArrowRight } from 'lucide-react';

const puzzleDatabase = {
  basic: [
    { clue: "7 D in a W", answer: "7 days in a week", difficulty: "Easy", category: "Time" },
    { clue: "12 M in a Y", answer: "12 months in a year", difficulty: "Easy", category: "Time" },
    { clue: "26 L in the A", answer: "26 letters in the alphabet", difficulty: "Easy", category: "Language" },
    { clue: "60 S in a M", answer: "60 seconds in a minute", difficulty: "Easy", category: "Time" },
  ],
  music: [
    { clue: "88 K's on a P", answer: "88 keys on a piano", difficulty: "Medium", category: "Music" },
    { clue: "4 S in a Q", answer: "4 strings in a quartet", difficulty: "Medium", category: "Music" },
    { clue: "6 S on a G", answer: "6 strings on a guitar", difficulty: "Medium", category: "Music" },
    { clue: "5 L in a SM", answer: "5 lines in a staff of music", difficulty: "Medium", category: "Music" },
  ],
  government: [
    { clue: "9 J on the SC", answer: "9 justices on the supreme court", difficulty: "Medium", category: "Government" },
    { clue: "100 S in C", answer: "100 senators in congress", difficulty: "Medium", category: "Government" },
    { clue: "27 A to the C", answer: "27 amendments to the constitution", difficulty: "Hard", category: "Government" },
    { clue: "50 S in the U", answer: "50 states in the union", difficulty: "Easy", category: "Government" },
  ],
  science: [
    { clue: "118 E on the PT", answer: "118 elements on the periodic table", difficulty: "Hard", category: "Science" },
    { clue: "206 B in a HS", answer: "206 bones in a human skeleton", difficulty: "Hard", category: "Science" },
    { clue: "8 P in the SS", answer: "8 planets in the solar system", difficulty: "Easy", category: "Science" },
    { clue: "4 C in a DNA", answer: "4 bases in dna", difficulty: "Medium", category: "Science" },
  ],
  literature: [
    { clue: "7 B in the HP", answer: "7 books in the harry potter series", difficulty: "Medium", category: "Literature" },
    { clue: "3 M in a B", answer: "3 musketeers in a book", difficulty: "Medium", category: "Literature" },
    { clue: "40 T in the W", answer: "40 thieves in ali baba", difficulty: "Hard", category: "Literature" },
    { clue: "5 D of ES", answer: "5 daughters of elizabeth and mr bennet", difficulty: "Hard", category: "Literature" },
  ]
};

const InitialCountsGame = () => {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Flatten puzzle database into daily sequence
  const dailyPuzzles = [
    ...puzzleDatabase.basic,
    ...puzzleDatabase.music,
    ...puzzleDatabase.government,
    ...puzzleDatabase.science,
    ...puzzleDatabase.literature,
  ].slice(0, 5); // Get first 5 puzzles for the day

  const currentPuzzle = dailyPuzzles[currentPuzzleIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAnswer = answer.toLowerCase().trim();
    const correctAnswer = currentPuzzle.answer.toLowerCase();
    
    if (cleanAnswer === correctAnswer || 
        (cleanAnswer.includes(correctAnswer.split(' ')[0]) && 
         cleanAnswer.includes(correctAnswer.split(' ').slice(-1)[0]))) {
      setShowSuccess(true);
      setShowError(false);
      setScore(score + (attempts * (currentPuzzle.difficulty === "Hard" ? 3 : 
                                  currentPuzzle.difficulty === "Medium" ? 2 : 1)));
    } else {
      setAttempts(prev => prev - 1);
      setShowError(true);
      setShowSuccess(false);
    }
  };

  const getHint = () => {
    const words = currentPuzzle.answer.split(' ');
    return `Hint: Starts with "${words[0]}" and ends with "${words[words.length - 1]}"`;
  };

  const nextPuzzle = () => {
    if (currentPuzzleIndex < dailyPuzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
      setAnswer('');
      setAttempts(3);
      setShowSuccess(false);
      setShowError(false);
      setShowHint(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    return {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'Hard': 'bg-red-100 text-red-800'
    }[difficulty];
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Initial Counts</h2>
            <p className="text-sm text-gray-500">Daily Puzzle {currentPuzzleIndex + 1}/5</p>
            <p className="text-sm text-gray-500 mt-1">Score: {score}</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>{attempts} tries left</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(currentPuzzle.difficulty)}`}>
                {currentPuzzle.difficulty}
              </span>
              <span className="text-sm text-gray-500">{currentPuzzle.category}</span>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-6 text-center">
            <h3 className="text-3xl font-bold">{currentPuzzle.clue}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full"
              disabled={attempts === 0 || showSuccess}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={attempts === 0 || showSuccess}
            >
              Submit Answer
            </Button>
          </form>

          {showSuccess && (
            <>
              <Alert className="mt-4 bg-green-50 border-green-200">
                <Trophy className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Correct! Well done!
                </AlertDescription>
              </Alert>
              {currentPuzzleIndex < dailyPuzzles.length - 1 && (
                <Button 
                  className="w-full mt-4"
                  onClick={nextPuzzle}
                >
                  Next Puzzle <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </>
          )}

          {showError && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertDescription className="text-red-600">
                Not quite right. Try again! ({attempts} attempts remaining)
              </AlertDescription>
            </Alert>
          )}

          {showHint && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                {getHint()}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex justify-between items-center pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHint(true)}
              disabled={showSuccess || showHint}
            >
              Need a hint?
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitialCountsGame;
