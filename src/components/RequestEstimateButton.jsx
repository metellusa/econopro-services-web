import Button from "./ui/Button";
import { useEstimateModal } from "../context/EstimateModalContext";

export default function RequestEstimateButton({
  children = "Request an Estimate",
  variant = "primary",
  size = "md",
  className = "",
  source = "button",
  onClick,
  ...props
}) {
  const { openEstimateModal } = useEstimateModal();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={(event) => {
        openEstimateModal(source);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
