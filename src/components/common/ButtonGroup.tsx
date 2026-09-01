import type { HTMLAttributes } from 'react';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  align?: 'left' | 'right' | 'between';
  responsive?: boolean;
  fullWidth?: boolean;
};

export function ButtonGroup({
  align = 'right',
  responsive = true,
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonGroupProps) {
  const classNames = [
    'btn-group',
    align === 'right' ? 'btn-group-right' : align === 'between' ? 'flex-between' : '',
    responsive ? 'btn-group-responsive' : '',
    fullWidth ? 'btn-group-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}
