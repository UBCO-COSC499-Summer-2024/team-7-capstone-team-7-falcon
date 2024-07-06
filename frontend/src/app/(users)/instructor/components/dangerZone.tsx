const DangerZone: React.FC = () => {
  return (
    <div className="ring-1 rounded ring-red-700 p-3 flex flex-col">
      <p className="font-bold text-lg mb-2">Danger Zone</p>
      <p className="font-bold mt-2">Delete Exam</p>
      <p>If you delete this exam, you will not be able to undo it</p>
      <button className="ring-1 rounded ring-red-700 p-1 m-3 items-center">
        <p className="text-red-700 text-lg">Delete Exam</p>
      </button>
    </div>
  );
};

export default DangerZone;
