import Game from "@/components/candy-crush/game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { availableStageType, fetchStage } from "../../components/available-stages";
import Modal from 'react-modal';
import ButtonPrimary from "@/components/button-primary";
import HowToPlay from "@/components/how-to-play";
import { motion } from "framer-motion";

export default function Page(){
  const router = useRouter()
  const [stage, setStage] = useState<availableStageType>()
  const [endgameStatus, setEndgameStatus] = useState("")
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const id = router.query
  useEffect(() => {
    async function init(){
      if (!router.query.id) return;
      
      const response = await fetchStage(router.query.id)
      if(!response?.success || !response?.stage?.goals){
        router.push('/game'); // Redirect to game selection if stage is invalid
        return;
      }
      
      // Update stage with new target and moves count
      const updatedStage = {
        ...response.stage,
        moveCount: 10,
        goals: Object.fromEntries(
          Object.entries(response.stage.goals).map(([key, _]) => [key, 15])
        )
      }
      setStage(updatedStage)
    }
    init()
  }, [router.query.id])

  return (
    <main className="bg-blue-100 dark:bg-gray-900 flex min-h-screen">
      <Modal
        isOpen={endgameStatus !== ""}
        contentLabel="Game End"
        style={{
          overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex'}, 
        }}
        className={`m-auto border-blue-600 dark:border-blue-700 rounded-xl border-4 bg-white dark:bg-gray-800 flex items-center justify-center flex-col px-10 py-5 outline-none`}
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-full text-3xl font-bold text-center mb-5 text-blue-600 dark:text-blue-400 flex flex-col items-center"
        >
          { endgameStatus === "win" ? 
            <>
              <motion.img 
                src={`/thumbs.svg`}
                className="w-48 h-48 mb-4"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              /> 
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You win!
              </motion.div>
            </> : <>
              <motion.img 
                src={`/lose.svg`}
                className="w-48 h-48 mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              /> 
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You lost.
              </motion.div>
            </>}
        </motion.div>
        <ButtonPrimary className={`text-3xl`} onClick={() => router.back()}>Back</ButtonPrimary>
      </Modal>

      <HowToPlay isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="m-auto flex flex-col border-4 border-blue-600 dark:border-blue-700 bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl relative"
      >
        <button 
          onClick={() => setShowHowToPlay(true)}
          className="absolute top-4 -left-56 p-2 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white transition-colors"
          aria-label="How to play"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <div className="" style={{minHeight: "100svh"}}>
          {
            !!stage ? <Game onGameFinished={setEndgameStatus} availablePieces={stage.availablePieces} initialBoard={stage.board} moveCount={stage.moveCount} goals={stage.goals}></Game>
            : null
          }
        </div>
      </motion.div>
    </main>
  )
}