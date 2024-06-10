

export const Appbar = ({ name }) => {
    return (
        <div className="h-14 flex justify-between bg-cyan-900">
            <div className="flex flex-col justify-center h-full ml-4 text-white">CodeBattle</div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4 text-white">   </div>
                <div className="   flex justify-center mr-4">
                    <div className="flex flex-col justify-center h-full text-xlb text-white">{name}</div>
                </div>
            </div>
        </div>
    );
}
