import { useContext, useEffect, useState } from "react"
import { useSwipeable } from "react-swipeable"
import { animated, useSpring } from '@react-spring/web'
import { AnimationSpeedContext } from "./animation-speed-context"
import { motion } from "framer-motion"

export function createEmptyPieceProps() : piecePropsType{
    return {
        type: 0,
        x: 0,
        y: 0,
        id: `piece${Math.floor(Math.random() * 10000)}`
    }
}

export default function Piece({tileSize = 20, type, onMove = () => {}, onClick = () => {}, id, x, y, isPopping = false, shakeDirection = ""} : piecePropsType){
    const animationSpeed = useContext(AnimationSpeedContext)
    const offset = tileSize * 0.125
    const size = tileSize * 0.75
    const [{left, top}, setPosition] = useState({left: x * tileSize + offset, top: y * tileSize + offset})
    
    const [positionSprings, positionApi] = useSpring(() => ({
        from: { x: left, y: top },
        config: {
            tension: 300,
            friction: 20
        }
    }))
    const [sizeSprings, sizeApi] = useSpring(() => ({
        from: { transform: `scale(0)` },
        to: { transform: `scale(1)` },
        config: {
            tension: 200,
            friction: 15
        },
    }))
    
    useEffect(() => {
        if(shakeDirection === ""){
            return
        }
        const from = {x : left, y: top}
        const config = {
            duration: animationSpeed.shaking
        }
        let to : {x?: number, y? : number}[] = []
        
        const rightKeyframes = [{ x : left + tileSize * 0.1 }, { x : left - tileSize * 0.1 }, { x : left + tileSize * 0.1 }, { x : left - tileSize * 0.1 }]
        const leftKeyframes = rightKeyframes.slice().reverse()
        const downKeyframes = [{ y : top + tileSize * 0.1 }, { y : top - tileSize * 0.1 }, { y : top + tileSize * 0.1 }, { y : top - tileSize * 0.1 }]
        const upKeyframes = downKeyframes.slice().reverse()
        
        if(shakeDirection === "right"){
            to = [...rightKeyframes, from]
        }else if(shakeDirection === "left"){
            to = [...leftKeyframes, from]
        }else if(shakeDirection === "down"){
            to = [...downKeyframes, from]
        }else if(shakeDirection === "up"){
            to = [...upKeyframes, from]
        }
        positionApi.start({
            to,
            config,
        })
    }, [shakeDirection])

    useEffect(() => {
        positionApi.start({x: left, y: top})
    }, [left, top])

    useEffect(() => {
        setPosition({left: x * tileSize + offset, top: y * tileSize + offset})
        positionApi.start({
            to: {x: x * tileSize + offset, y: y * tileSize + offset},
            config: {
                duration: animationSpeed.move
            }
        })
    }, [x, y])

    useEffect(() => {
        if(!isPopping){
            return
        }
        sizeApi.start({
            to: [
                { transform: `scale(1.2)` },
                { transform: `scale(0)` }
            ],
            config: {
                duration: animationSpeed.pop / 2
            }
        })
    }, [isPopping])

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            const { dir } = eventData;
            if (dir === 'Up') onMove({x, y}, {dy: -1});
            if (dir === 'Down') onMove({x, y}, {dy: 1});
            if (dir === 'Left') onMove({x, y}, {dx: -1});
            if (dir === 'Right') onMove({x, y}, {dx: 1});
        },
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    if(type === 0 || type === -777){
        return <></>
    }

    const getImagePath = (type: number) => {
        if (type === -1) return '/pieces/piece--1.svg'
        if (type === -2) return '/pieces/piece--2.svg'
        return `/pieces/piece-${type}.svg`
    }

    return <animated.div 
        {...handlers}
        onClick={() => onClick(x, y)}
        onTouchStart={(e) => {
            e.preventDefault(); // Prevent double-tap zoom
        }}
        style={{
            ...positionSprings,
            position: "absolute",
            width: size,
            height: size,
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent", // Remove tap highlight on mobile
            touchAction: "none", // Disable browser handling of gestures
            WebkitUserSelect: "none",
            userSelect: "none"
        }}
    >
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{width: "100%", height: "100%"}}
        >
            <animated.img style={{
                ...sizeSprings,
                width: "100%",
                height: "100%",
            }} src={getImagePath(type)}/>
        </motion.div>
    </animated.div>
}