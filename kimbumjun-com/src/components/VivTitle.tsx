import DesktopMacOutlinedIcon from '@mui/icons-material/DesktopMacOutlined';

interface VivTitleProps {
  title: string;
  fontColor?: string;
}

export default function VivTitle({
  title,
  fontColor,
}: VivTitleProps) {
  return (
    <h2
      className={`${fontColor ?? 'text-sky-800'
        }
          rounded-full
          var(--font-cute)
          flex items-center
          justify-center
          text-center
          font-cute`}>
      <DesktopMacOutlinedIcon sx={{ mr: 1 }} />
      {title}
    </h2>
  );
}
