export const Spinner = ({ small }) => (
  <div className="flex items-center justify-center">
    <div
      className={`border-4 border-gray-200 rounded-full animate-spin ${small ? "w-5 h-5" : "w-10 h-10"}`}
      style={{ borderTopColor: "#ea580c" }}
    />
  </div>
);
