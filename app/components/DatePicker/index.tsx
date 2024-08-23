import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerComponent({ onChange }: Readonly<any>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer sx={{ pt: 0}} components={['DatePicker']}>
        <DatePicker sx={{ width: '100%' }} openTo="year" views={["year"]} onChange={onChange}/>
      </DemoContainer>
    </LocalizationProvider>
  );
}