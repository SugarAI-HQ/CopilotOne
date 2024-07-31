import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import MessageWorkflow from "../MessageWorkflow";

interface ContextType {
  workflow: MessageWorkflow;
  setWorkflow: (workflow: MessageWorkflow) => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};

interface WorkflowProviderProps {
  defaultWorklfow?: MessageWorkflow | null;
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
  defaultWorklfow = null,
  children,
}) => {
  const [workflow, setWorkflow] = useState<MessageWorkflow>(
    defaultWorklfow as MessageWorkflow,
  );

  useEffect(() => {
    if (!workflow) {
      setWorkflow((wf) => {
        if (!wf) {
          return new MessageWorkflow();
        } else {
          return wf;
        }
      });
    }
  }, [workflow]);

  return (
    <Context.Provider
      value={{
        workflow,
        setWorkflow,
      }}
    >
      {children}
    </Context.Provider>
  );
};
