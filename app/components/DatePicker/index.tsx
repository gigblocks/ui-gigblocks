import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerComponent({ onChange, isYearOnly }: Readonly<{ onChange: any, isYearOnly: boolean }>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DemoContainer sx={{ pt: 0}} components={['DatePicker']}>
        {isYearOnly ? 
          <DatePicker sx={{ width: '100%' }} openTo="year" views={["year"]} onChange={onChange}/>
        : <DatePicker disablePast sx={{ width: '100%' }} onChange={onChange}/>
        }
      </DemoContainer>
    </LocalizationProvider>
  );
}