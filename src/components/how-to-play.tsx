import Modal from 'react-modal';
import ButtonPrimary from './button-primary';

type HowToPlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
    return (
        <Modal
            isOpen={isOpen}
            contentLabel="How To Play"
            style={{
                overlay: { 
                    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                content: {
                    position: 'relative',
                    inset: 'auto'
                }
            }}
            className={`border-blue-600 dark:border-blue-700 rounded-xl border-4 bg-white dark:bg-gray-800 flex flex-col px-8 py-6 outline-none max-w-lg w-11/12 sm:w-full`}
        >
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">How to Play</h2>
            <div className="text-blue-900 dark:text-blue-100 space-y-4">
                <p>🎯 <strong>Goal:</strong> Match pieces to reach the target numbers shown at the top.</p>
                <div className="space-y-2">
                    <p><strong>Rules:</strong></p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Swap adjacent pieces to create matches of 3 or more</li>
                        <li>Pieces can be swapped horizontally or vertically</li>
                        <li>Complete the targets before running out of moves</li>
                        <li>Some tiles are blocked and cannot be moved</li>
                    </ul>
                </div>
                <p>💡 <strong>Tip:</strong> Plan your moves carefully to maximize matches!</p>
            </div>
            <ButtonPrimary onClick={onClose} className="mt-6">Got it!</ButtonPrimary>
        </Modal>
    );
}
