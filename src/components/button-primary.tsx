import Button from "./button";

export default function ButtonPrimary(props : any){
    return <Button  {...props} className={`bg-blue-500 dark:bg-blue-700 text-white border-white hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors`}>{props.children}</Button>
}