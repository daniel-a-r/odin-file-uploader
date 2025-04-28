import app from './config/app.config.js';
import indexRouter from './routes/indexRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import { console } from 'node:inspector';

const PORT = process.env.PORT || 3000;

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

app.use((req, res) => {
  res
    .status(404)
    .render('notFound', { title: 'Not Found', errMsg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  let statusCode = null;
  let errorMsg = 'Internal Server Error';
  console.error(err);
  if (err.code === 'P2025') {
    statusCode = 404;
    errorMsg = 'Record Not Found';
  }
  res.status(statusCode || 500).render('error', { errorMsg });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
